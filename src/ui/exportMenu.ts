/** Menu flutuante reutilizável. */
import { el, icon } from './controls';

export interface MenuItem {
  label: string;
  icon?: string;
  onClick: () => void;
  separatorBefore?: boolean;
}

let activeMenu: HTMLElement | null = null;
let closeActive: (() => void) | null = null;

export function closeMenu(): void {
  closeActive?.();
}

export function openMenu(anchor: HTMLElement, items: MenuItem[], title?: string): void {
  closeMenu();
  const menu = el('div', { class: 'menu', role: 'menu' });
  if (title) menu.append(el('div', { class: 'menu-title' }, title));

  for (const item of items) {
    if (item.separatorBefore) menu.append(el('div', { class: 'menu-sep' }));
    const node = el('button', { type: 'button', role: 'menuitem' });
    if (item.icon) node.append(icon(item.icon, 16));
    node.append(el('span', {}, item.label));
    node.addEventListener('click', () => {
      closeMenu();
      item.onClick();
    });
    menu.append(node);
  }

  document.body.append(menu);
  activeMenu = menu;

  const rect = anchor.getBoundingClientRect();
  const menuRect = menu.getBoundingClientRect();
  let left = rect.right - menuRect.width;
  let top = rect.bottom + 8;
  if (left < 10) left = 10;
  if (left + menuRect.width > window.innerWidth - 10) left = window.innerWidth - menuRect.width - 10;
  if (top + menuRect.height > window.innerHeight - 10) top = rect.top - menuRect.height - 8;
  menu.style.left = `${Math.max(10, left)}px`;
  menu.style.top = `${Math.max(10, top)}px`;

  const onPointerDown = (event: PointerEvent): void => {
    if (activeMenu && !activeMenu.contains(event.target as Node)) closeMenu();
  };
  const onKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') closeMenu();
  };

  closeActive = () => {
    menu.remove();
    document.removeEventListener('pointerdown', onPointerDown);
    document.removeEventListener('keydown', onKey);
    if (activeMenu === menu) activeMenu = null;
    closeActive = null;
  };

  window.setTimeout(() => {
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
  }, 0);
}
