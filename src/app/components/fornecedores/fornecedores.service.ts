import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Fornecedor } from '../../model/fornecedor';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class FornecedorService {
  constructor(private http: HttpClient) {}

  getFornecedores(): Observable<Fornecedor[]> {
    return this.http.get<Fornecedor[]>(`${API_URL}/fornecedor`);
  }

  getFornecedorById(id: number): Observable<Fornecedor> {
    return this.http.get<Fornecedor>(`${API_URL}/fornecedor/${id}`);
  }

  getFornecedoresByRazaoSocial(razaoSocial: string): Observable<Fornecedor[]> {
    return this.http.get<Fornecedor[]>(
      `${API_URL}/fornecedor/descricao/like/${razaoSocial}`
    );
  }

  createFornecedor(fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.http.post<Fornecedor>(`${API_URL}/fornecedor`, fornecedor);
  }

  updateFornecedor(fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.http.put<Fornecedor>(`${API_URL}/fornecedor/`, fornecedor);
  }

  deleteFornecedor(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/fornecedor/${id}`);
  }
}
