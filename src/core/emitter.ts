/** Sinal simples de assinatura, sem dependências. */
export type Listener<T> = (value: T) => void;

export class Signal<T = void> {
  private listeners = new Set<Listener<T>>();

  on(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(value: T): void {
    for (const listener of [...this.listeners]) {
      try {
        listener(value);
      } catch (error) {
        console.error('Erro em listener do store', error);
      }
    }
  }

  clear(): void {
    this.listeners.clear();
  }
}
