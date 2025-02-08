export interface ItemNotaFiscal {
  id: number | null;
  produtoId: number;
  valorUnitario: number;
  quantidade: number;
  valorTotal: number;
  produto?: any;
}
