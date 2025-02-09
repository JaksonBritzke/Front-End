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

  createNota(notaFiscal: NotaFiscal): Observable<NotaFiscal> {
    const nf = this.converterDataParaUTC(notaFiscal);
    return this.http.post<NotaFiscal>(`${API_URL}/notas`, nf);
  }

  updateNota(notaFiscal: NotaFiscal): Observable<NotaFiscal> {
    const nf = this.converterDataParaUTC(notaFiscal)
    return this.http.put<NotaFiscal>(`${API_URL}/notas/`, nf);
  }

  deleteNota(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/notas/${id}`);
  }

  private converterDataParaUTC(notaFiscal: NotaFiscal): NotaFiscal {
    if (notaFiscal.dataEmissao) {
      const dataLocal = new Date(notaFiscal.dataEmissao); // Converte a string para um objeto Date
      const dataUTC = new Date(
        Date.UTC(
          dataLocal.getFullYear(),
          dataLocal.getMonth(),
          dataLocal.getDate(),
          dataLocal.getHours(),
          dataLocal.getMinutes(),
          dataLocal.getSeconds()
        )
      );
      notaFiscal.dataEmissao = dataUTC.toISOString(); // Atualiza a dataEmissao para UTC
    }
    return notaFiscal;
  }
}
