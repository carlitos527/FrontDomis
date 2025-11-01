// src/app/services/pago.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PagoDTO {
  pagoID?: number;
  pedidoID: number;
  metodoPago: string;
  monto: number;
  fechaPago?: string;
  estado?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private baseUrl = 'http://localhost:5273/api/pagos';

  constructor(private http: HttpClient) {}

  getPagosPorPedido(pedidoId: number): Observable<PagoDTO[]> {
    return this.http.get<PagoDTO[]>(`${this.baseUrl}/pedido/${pedidoId}`);
  }

  getPago(id: number): Observable<PagoDTO> {
    return this.http.get<PagoDTO>(`${this.baseUrl}/${id}`);
  }

  crearPago(pago: PagoDTO): Observable<PagoDTO> {
    return this.http.post<PagoDTO>(this.baseUrl, pago);
  }

  actualizarPago(id: number, pago: PagoDTO): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, pago);
  }

  eliminarPago(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
