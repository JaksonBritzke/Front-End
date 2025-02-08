import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Produto } from '../../model/produto';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  constructor(private http: HttpClient) {}

  getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${API_URL}/produtos`);
  }

  getProdutosById(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${API_URL}/produtos/${id}`);
  }

  getProdutosByDescricao(descricao: string): Observable<Produto> {
    return this.http.get<Produto>(`${API_URL}/produtos/descricao/${descricao}`);
  }

  getProdutosByRazaoSocial(razaoSocial: string): Observable<Produto[]> {
    return this.http.get<Produto[]>(
      `${API_URL}/Produtos/descricao/like/${razaoSocial}`
    );
  }

  createProduto(Produtos: Produto): Observable<Produto> {
    return this.http.post<Produto>(`${API_URL}/produtos`, Produtos);
  }

  updateProduto(id: number, Produtos: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${API_URL}/produtos/${id}`, Produtos);
  }

  deleteProduto(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/produtos/${id}`);
  }
}
