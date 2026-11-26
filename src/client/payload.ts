/** Dados embutidos no HTML exportado para o cliente. */
import type { Plan } from '../core/document';

export const CLIENT_PLAN_ELEMENT_ID = 'ctv-plan';

export interface ClientViewPayload {
  version: 1;
  plan: Plan;
  createdAt: string;
}
