/** Diálogo de ajuda com atalhos e dicas. */
import { el, openModal } from './controls';

const SHORTCUTS: { keys: string[]; text: string }[] = [
  { keys: ['V'], text: 'Selecionar e mover' },
  { keys: ['P'], text: 'Desenhar parede' },
  { keys: ['C'], text: 'Criar cômodo' },
  { keys: ['T'], text: 'Inserir porta' },
  { keys: ['J'], text: 'Inserir janela' },
  { keys: ['M'], text: 'Medir distância' },
  { keys: ['3'], text: 'Abrir a vista 3D' },
  { keys: ['R'], text: 'Girar 90°' },
  { keys: ['Del'], text: 'Excluir seleção' },
  { keys: ['Ctrl', 'Z'], text: 'Desfazer' },
  { keys: ['Ctrl', 'Shift', 'Z'], text: 'Refazer' },
  { keys: ['Ctrl', 'D'], text: 'Duplicar' },
  { keys: ['Ctrl', 'C'], text: 'Copiar' },
  { keys: ['Ctrl', 'V'], text: 'Colar' },
  { keys: ['Ctrl', 'A'], text: 'Selecionar todos os móveis' },
  { keys: ['Ctrl', '0'], text: 'Enquadrar a planta' },
  { keys: ['Shift'], text: 'Trava proporção e ignora encaixe' },
  { keys: ['G'], text: 'Mostrar/ocultar grade' },
  { keys: ['S'], text: 'Ligar/desligar encaixe' },
  { keys: ['I'], text: 'Mostrar/ocultar cotas' },
  { keys: ['L'], text: 'Travar/desbloquear seleção' },
  { keys: ['Espaço'], text: 'Arrastar para navegar' },
  { keys: ['Botão direito'], text: 'Arrastar a planta' },
  { keys: ['Roda'], text: 'Zoom no cursor' },
  { keys: ['Ctrl', 'S'], text: 'Salvar planta em JSON' },
];

const TIPS: string[] = [
  'Arraste um móvel da lista à esquerda direto para a planta.',
  'Portas e janelas se prendem à parede mais próxima e abrem o vão de verdade.',
  'As alças nos cantos redimensionam; a alça redonda gira em passos de 15°.',
  'Clique no canto de um cômodo para criar ambientes com área calculada.',
  'Use o inspetor à direita para trocar materiais, medidas e etiquetas.',
];

export function openHelpDialog(): void {
  const shortcutList = el('ul', {});
  for (const item of SHORTCUTS) {
    shortcutList.append(
      el(
        'li',
        {},
        el('span', {}, ...item.keys.map((key) => el('kbd', { class: 'k' }, key))),
        el('span', {}, item.text),
      ),
    );
  }

  const tipsList = el('ul', {});
  for (const tip of TIPS) {
    tipsList.append(el('li', {}, el('span', {}, '·'), el('span', {}, tip)));
  }

  const body = el(
    'div',
    {},
    el(
      'div',
      { class: 'help-grid' },
      el('div', {}, el('h4', {}, 'Atalhos'), shortcutList),
      el('div', {}, el('h4', {}, 'Como usar'), tipsList),
    ),
  );

  openModal({
    title: 'Como usar o casaTopView',
    subtitle: 'Desenhe a estrutura, defina os ambientes e mobílie arrastando os itens do catálogo.',
    body,
  });
}
