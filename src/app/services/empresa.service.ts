import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Empresa {
  empresaID?: number;
  nombre: string;
  direccion?: string;
  telefono?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  private baseUrl = 'http://localhost:5273/api/empresa'; // Ajustar URL según tu backend

  constructor(private http: HttpClient) {}

  getAll(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(this.baseUrl);
  }

  getById(id: number): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.baseUrl}/${id}`);
  }

  create(empresa: Empresa): Observable<Empresa> {
    return this.http.post<Empresa>(this.baseUrl, empresa);
  }

  update(id: number, empresa: Empresa): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, empresa);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
