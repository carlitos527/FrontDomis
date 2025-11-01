// src/app/services/pedido.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PedidoDetalleDTO {
  productoID: number;
  cantidad: number;
  precioUnitario: number;
}

export interface PedidoDTO {
  clienteID: number;
  domiciliarioID?: number;
  zonaID?: number;
  estado: string;
  notas?: string;
  fechaPedido: string;
  detalles: PedidoDetalleDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private baseUrl = 'http://localhost:5273/api/pedidos';

  constructor(private http: HttpClient) {}

  getPedidos(): Observable<PedidoDTO[]> {
    return this.http.get<PedidoDTO[]>(this.baseUrl);
  }

  getPedido(id: number): Observable<PedidoDTO> {
    return this.http.get<PedidoDTO>(`${this.baseUrl}/${id}`);
  }

  crearPedido(pedido: PedidoDTO): Observable<PedidoDTO> {
    return this.http.post<PedidoDTO>(this.baseUrl, pedido);
  }

  actualizarPedido(id: number, pedido: PedidoDTO): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, pedido);
  }

  eliminarPedido(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
