/** Exportação em PDF: planta baixa e maquete 3D, cada uma em sua página. */
import type { Plan } from '../core/document';
import { planFileSlug, planImageCanvas } from './png';
import { renderPlanSnapshot } from '../view3d/snapshot';

export type PdfMode = 'both' | 'plan' | 'view3d';

/** A4 paisagem, em pontos. */
const PAGE_W = 842;
const PAGE_H = 595;
const MARGIN = 36;
const CAPTION_GAP = 30;

interface PdfImage {
  bytes: Uint8Array;
  width: number;
  height: number;
}

interface PdfPage {
  image: PdfImage;
  caption: string;
}

/** Caracteres tipográficos ausentes do Latin-1, nos códigos WinAnsi do PDF. */
const WIN_ANSI: Record<string, number> = {
  '€': 0x80,
  '…': 0x85,
  '‘': 0x91,
  '’': 0x92,
  '“': 0x93,
  '”': 0x94,
  '•': 0x95,
  '–': 0x96,
  '—': 0x97,
};

/** Texto do PDF na página de código WinAnsi (usada pela fonte Helvetica). */
function latin1(text: string): Uint8Array {
  const bytes = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const mapped = WIN_ANSI[char];
    const code = text.charCodeAt(i);
    bytes[i] = mapped ?? (code <= 0xff ? code : 0x3f);
  }
  return bytes;
}

function jpegFromCanvas(canvas: HTMLCanvasElement): PdfImage | null {
  const base64 = canvas.toDataURL('image/jpeg', 0.92).split(',')[1];
  if (!base64) return null;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return { bytes, width: canvas.width, height: canvas.height };
}

function pdfText(text: string): string {
  return `(${text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')})`;
}

function buildPdf(pages: PdfPage[]): Blob {
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [];
  let size = 0;

  const write = (data: string | Uint8Array): void => {
    const bytes = typeof data === 'string' ? latin1(data) : data;
    chunks.push(bytes);
    size += bytes.length;
  };
  const open = (id: number): void => {
    offsets[id] = size;
    write(`${id} 0 obj\n`);
  };
  const close = (): void => write('endobj\n');

  write('%PDF-1.4\n');

  const pageIds = pages.map((_, index) => 4 + index * 3);
  open(1);
  write('<< /Type /Catalog /Pages 2 0 R >>\n');
  close();

  open(2);
  write(`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>\n`);
  close();

  open(3);
  write('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\n');
  close();

  pages.forEach((page, index) => {
    const pageId = pageIds[index];
    const contentId = pageId + 1;
    const imageId = pageId + 2;

    const areaW = PAGE_W - MARGIN * 2;
    const areaH = PAGE_H - MARGIN * 2 - CAPTION_GAP;
    const scale = Math.min(areaW / page.image.width, areaH / page.image.height);
    const drawW = page.image.width * scale;
    const drawH = page.image.height * scale;
    const x = MARGIN + (areaW - drawW) / 2;
    const y = MARGIN + (areaH - drawH) / 2;

    const content = [
      'BT',
      '/F1 14 Tf',
      `${MARGIN} ${PAGE_H - MARGIN - 4} Td`,
      `${pdfText(page.caption)} Tj`,
      'ET',
      'q',
      `${drawW.toFixed(2)} 0 0 ${drawH.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)} cm`,
      '/Im0 Do',
      'Q',
      '',
    ].join('\n');
    const contentBytes = latin1(content);

    open(pageId);
    write(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] ` +
        `/Resources << /XObject << /Im0 ${imageId} 0 R >> /Font << /F1 3 0 R >> >> ` +
        `/Contents ${contentId} 0 R >>\n`,
    );
    close();

    open(contentId);
    write(`<< /Length ${contentBytes.length} >>\nstream\n`);
    write(contentBytes);
    write('endstream\n');
    close();

    open(imageId);
    write(
      `<< /Type /XObject /Subtype /Image /Width ${page.image.width} /Height ${page.image.height} ` +
        `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode ` +
        `/Length ${page.image.bytes.length} >>\nstream\n`,
    );
    write(page.image.bytes);
    write('\nendstream\n');
    close();
  });

  const xref = size;
  const total = 3 + pages.length * 3 + 1;
  write(`xref\n0 ${total}\n`);
  write('0000000000 65535 f \n');
  for (let id = 1; id < total; id++) {
    write(`${String(offsets[id] ?? 0).padStart(10, '0')} 00000 n \n`);
  }
  write(`trailer\n<< /Size ${total} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);

  const data = new Uint8Array(size);
  let cursor = 0;
  for (const chunk of chunks) {
    data.set(chunk, cursor);
    cursor += chunk.length;
  }
  return new Blob([data], { type: 'application/pdf' });
}

const SUFFIX: Record<PdfMode, string> = {
  both: 'planta-3d',
  plan: 'planta',
  view3d: 'vista-3d',
};

/** Gera o PDF e dispara o download. Retorna false se nada pôde ser desenhado. */
export function exportPlanPdf(plan: Plan, mode: PdfMode = 'both'): boolean {
  const pages: PdfPage[] = [];

  if (mode !== 'view3d') {
    const canvas = planImageCanvas(plan);
    const image = canvas ? jpegFromCanvas(canvas) : null;
    if (!image) return false;
    pages.push({ image, caption: `Planta baixa — ${plan.name}` });
  }

  if (mode !== 'plan') {
    const canvas = renderPlanSnapshot(plan);
    const image = canvas ? jpegFromCanvas(canvas) : null;
    if (!image) return false;
    pages.push({ image, caption: `Vista 3D — ${plan.name}` });
  }

  if (!pages.length) return false;

  const url = URL.createObjectURL(buildPdf(pages));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${planFileSlug(plan.name)}-${SUFFIX[mode]}.pdf`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
  return true;
}
