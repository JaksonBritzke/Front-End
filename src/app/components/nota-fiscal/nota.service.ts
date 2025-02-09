import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NotaFiscal } from '../../model/nota-fiscal';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class NotaService {
  constructor(private http: HttpClient) {}

  getNotas(): Observable<NotaFiscal[]> {
    return this.http.get<NotaFiscal[]>(`${API_URL}/notas`);
  }

  getNotasByNumero(id: number): Observable<NotaFiscal> {
    return this.http.get<NotaFiscal>(`${API_URL}/notas/${id}`);
  }

  createNota(notaFiscal: NotaFiscal): Observable<NotaFiscal> {
    return this.http.post<NotaFiscal>(`${API_URL}/notas`, notaFiscal);
  }

  updateNota(notaFiscal: NotaFiscal): Observable<NotaFiscal> {
    return this.http.put<NotaFiscal>(`${API_URL}/notas/`, notaFiscal);
  }

  deleteNota(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/notas/${id}`);
  }
}
