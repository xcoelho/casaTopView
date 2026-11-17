/** Avisos rápidos no rodapé da tela. */
let container: HTMLElement | null = null;
let lastMessage = '';
let lastAt = 0;

function ensureContainer(): HTMLElement {
  if (container && container.isConnected) return container;
  container = document.createElement('div');
  container.className = 'toasts';
  document.body.append(container);
  return container;
}

export function notify(message: string, variant: 'default' | 'accent' = 'default'): void {
  const now = Date.now();
  if (message === lastMessage && now - lastAt < 1200) return;
  lastMessage = message;
  lastAt = now;

  const root = ensureContainer();
  const toast = document.createElement('div');
  toast.className = `toast${variant === 'accent' ? ' accent' : ''}`;
  toast.textContent = message;
  root.append(toast);

  window.setTimeout(() => {
    toast.classList.add('leaving');
    window.setTimeout(() => toast.remove(), 260);
  }, 2800);
}
