import { SituacaoFornecedor } from './enum/situacao-fornecedor';

export interface Fornecedor {
  codigo: number;
  razaoSocial: string;
  nome: string;
  email: string;
  endereco: string;
  telefone: string;
  cnpj: string;
  situacao: SituacaoFornecedor;
  dataBaixa: Date;
}
