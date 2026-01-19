import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UsuarioCreateDTO {
  nombreUsuario: string;
  password: string;
  rol?: string;
  empresaID?: number;
}

export interface LoginDTO {
  nombreUsuario: string;
  password: string;
}

export interface UsuarioResponseDTO {
  usuarioID: number;
  nombreUsuario: string;
  rol: string;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  private baseUrl = 'http://localhost:5273/api/usuarios'; // cambia si tu backend corre en otro puerto

  constructor(private http: HttpClient) {}

  registrar(dto: UsuarioCreateDTO): Observable<UsuarioResponseDTO> {
    return this.http.post<UsuarioResponseDTO>(`${this.baseUrl}/registrar`, dto);
  }

  login(dto: LoginDTO): Observable<UsuarioResponseDTO> {
    return this.http.post<UsuarioResponseDTO>(`${this.baseUrl}/login`, dto);
  }

  isLoggedIn(): boolean {
  return !!localStorage.getItem('token');
}

logout(): void {
  localStorage.removeItem('token');
}

getPerfil(): Observable<UsuarioResponseDTO> {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.get<UsuarioResponseDTO>(`${this.baseUrl}/perfil`, { headers });
}

guardarUsuarioLocal(usuario: UsuarioResponseDTO) {
  localStorage.setItem('token', usuario.token);
  localStorage.setItem('usuario', JSON.stringify(usuario));
}

obtenerUsuarioLocal(): UsuarioResponseDTO | null {
  const data = localStorage.getItem('usuario');
  return data ? JSON.parse(data) : null;
}


}
