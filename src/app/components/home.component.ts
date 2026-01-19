import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmpresaService } from '../services/empresa.service';
import { UsuarioService, UsuarioResponseDTO  } from '../services/usuario.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: []
})
export class HomeComponent implements OnInit {

  usuarioActual: UsuarioResponseDTO | null = null;

  constructor(private router: Router, 
    private empresaService: EmpresaService, 
    private usuarioService: UsuarioService) {}

  ngOnInit() {
  const token = localStorage.getItem('token');

   if (!token) {
      // si no hay sesión iniciada, mandamos al login
      this.router.navigate(['/login']);
      return;
    }

    // si hay token, obtenemos la información del usuario logueado
    this.usuarioService.getPerfil().subscribe({
      next: (usuario) => {
        this.usuarioActual = usuario;
      },
      error: (err) => {
        console.error('Error al obtener perfil', err);
        // si el token es inválido o expiró
        this.usuarioService.logout();
        this.router.navigate(['/login']);
      }
    });
  }


cerrarSesion() {
  this.usuarioService.logout();
  this.router.navigate(['/login']);
}



     goToclientes() {
    this.router.navigate(['/clientes']);
  }

    goTodomicilio() {
    this.router.navigate(['/domiciliarios']);
  }

   goToempresas() {
    this.router.navigate(['/empresa']);
  }
  
   goTopagos() {
    this.router.navigate(['/pagos']);
  }

   goToProductos() {
    this.router.navigate(['/productos']);
  }

   goTopedidos() {
    this.router.navigate(['/pedidos']);
  }

  goToEmpresa() {
    this.router.navigate(['/empresa']);
  }

  goToZonas() {
    this.router.navigate(['/zonas']);
  }

  goTousuarios() {
    this.router.navigate(['/usuarios/gestion']);
  }
}
