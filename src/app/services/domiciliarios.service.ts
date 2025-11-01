import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Domiciliario {
  domiciliarioID: number;
  nombre: string;
  telefono: string;
  vehiculo?: string;
  estado: string;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface DomiciliarioDTO {
  nombre: string;
  telefono: string;
  vehiculo?: string;
  estado?: string;
  createdBy: string;
  updatedBy?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DomiciliariosService {

  private apiUrl = 'http://localhost:5273/api/Domiciliarios'; // Cambia por tu URL

  constructor(private http: HttpClient) { }

  getAll(): Observable<Domiciliario[]> {
    return this.http.get<Domiciliario[]>(this.apiUrl);
  }

  getById(id: number): Observable<Domiciliario> {
    return this.http.get<Domiciliario>(`${this.apiUrl}/${id}`);
  }

  create(domiciliario: DomiciliarioDTO): Observable<Domiciliario> {
    return this.http.post<Domiciliario>(this.apiUrl, domiciliario);
  }

  update(id: number, domiciliario: DomiciliarioDTO) {
    return this.http.put(`${this.apiUrl}/${id}`, domiciliario);
  }

  delete(id: number, usuario: string) {
    return this.http.delete(`${this.apiUrl}/${id}?usuario=${usuario}`);
  }
}
