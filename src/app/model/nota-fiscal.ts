import { ItemNotaFiscal } from './item-nota-fiscal';

export interface NotaFiscal {
  id: number;
  numero: number;
  dataEmissao: Date;
  fornecedorId: number;
  valorTotal: number;
  status: string;
  itens: ItemNotaFiscal[];
}
