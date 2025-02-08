import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Fornecedor } from '../../model/fornecedor';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class FornecedorService {
  constructor(private http: HttpClient) {}


  getFornecedores() {
    return this.http.get<Fornecedor[]>(`${API_URL}/fornecedor`);
}
}
