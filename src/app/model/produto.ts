import { SituacaoProduto } from './enum/situacao-produto.';

export interface Produto {
  codigo: number;
  descricao: string;
  situacao: SituacaoProduto;
}
