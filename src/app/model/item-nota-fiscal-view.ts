import { Produto } from './produto';

export interface ItemNotaFiscalView {
  id: any;
  produtoId: number;
  valorUnitario: number;
  quantidade: number;
  valorTotal: number;
  produto: Produto;
}
