
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UsuarioService, UsuarioCreateDTO, UsuarioResponseDTO } from '../services/usuario.service';

@Component({
  selector: 'app-usuarios-gestion',
   standalone: true,
  imports: [CommonModule, FormsModule], // <-- AGREGA AQUÍ
  templateUrl: './usuarios-gestion.component.html',
  styleUrls: []
})
export class UsuariosGestionComponent implements OnInit {
  usuarioActual: UsuarioResponseDTO | null = null;
  nuevoUsuario: UsuarioCreateDTO = {
    nombreUsuario: '',
    password: '',
    rol: '',
    empresaID: undefined
  };
  mensaje: string = '';
  error: string = '';

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuarioActual();
  }

  // --- Obtener información del usuario logueado ---
  cargarUsuarioActual(): void {
    const usuarioLocal = this.usuarioService.obtenerUsuarioLocal();
    if (usuarioLocal) {
      this.usuarioActual = usuarioLocal;
    } else {
      this.usuarioService.getPerfil().subscribe({
        next: (data) => (this.usuarioActual = data),
        error: () => (this.error = 'No se pudo cargar el perfil')
      });
    }
  }

  // --- Registrar un nuevo usuario ---
  registrarUsuario(): void {
    this.mensaje = '';
    this.error = '';

    this.usuarioService.registrar(this.nuevoUsuario).subscribe({
      next: (res) => {
        this.mensaje = `Usuario ${res.nombreUsuario} creado exitosamente`;
        this.nuevoUsuario = { nombreUsuario: '', password: '', rol: '', empresaID: undefined };
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al crear el usuario';
      }
    });
  }
}
