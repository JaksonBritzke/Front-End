import { ItemNotaFiscal } from "./ItemNotaFiscal";

export interface NotaFiscal {
  id: number;
  numero: number;
  dataEmissao: Date;
  fornecedorId: number;
  valorTotal: number;
  status: string;
  itens: ItemNotaFiscal[];
}
