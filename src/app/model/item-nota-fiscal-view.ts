import { Produto } from './produto';

export interface ItemNotaFiscalView {
  id: number;
  produtoId: number;
  valorUnitario: number;
  quantidade: number;
  valorTotal: number;
  produto: Produto;
}
