import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Zona {
  zonaID?: number;
  nombre: string;
  tarifaEnvio: number;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ZonaService {
  private apiUrl = 'http://localhost:5273/api/Zona';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAll(): Observable<Zona[]> {
    return this.http.get<Zona[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getById(id: number): Observable<Zona> {
    return this.http.get<Zona>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  create(zona: Zona): Observable<Zona> {
    return this.http.post<Zona>(this.apiUrl, zona, { headers: this.getHeaders() });
  }

  update(id: number, zona: Zona): Observable<Zona> {
    return this.http.put<Zona>(`${this.apiUrl}/${id}`, zona, { headers: this.getHeaders() });
  }

  delete(id: number, deletedBy: string = ''): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}?deletedBy=${deletedBy}`, { headers: this.getHeaders() });
  }
}
