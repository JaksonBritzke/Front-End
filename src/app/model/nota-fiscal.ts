import { ItemNotaFiscal } from './item-nota-fiscal';

export interface NotaFiscal {
  id: number;
  numero: number;
  dataEmissao: string;
  fornecedorId: number;
  fornecedorNome: number;
  valorTotal: number;
  status: string;
  itens: ItemNotaFiscal[];
}
