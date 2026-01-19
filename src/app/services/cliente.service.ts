import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cliente {
  clienteID: number;
  nombre: string;
  telefono: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  zonaID?: number;
  zonaNombre?: string;
}

export interface ClienteDTO {
  nombre: string;
  telefono: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  zonaID?: number;
   createdBy?: string; // <--- agregado
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private apiUrl = 'http://localhost:5273/api/Cliente'; // Ajusta la URL si es necesario

  constructor(private http: HttpClient) { }

  getAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  getById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  create(cliente: ClienteDTO): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  update(id: number, cliente: ClienteDTO): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
