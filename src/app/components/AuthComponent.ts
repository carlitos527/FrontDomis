import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService, UsuarioCreateDTO } from '../services/usuario.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.css']
})
export class AuthComponent {
  mode = signal<'login' | 'register'>('login');
  error = signal('');
  success = signal('');
  loading = signal(false);
  isLoggedIn = signal(false); // ✅ controla si ya se logueó

  nombreUsuario = signal('');
  password = signal('');
  rol = signal('Clientes');
  empresaID = signal<number | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService
  ) {
    // Si viene empresaID por URL => registro automático
    this.route.queryParams.subscribe(params => {
      if (params['empresaID']) {
        this.empresaID.set(+params['empresaID']);
        this.mode.set('register');
      }
    });
     // 👇 Si ya está logueado, redirige al home directamente
  if (this.usuarioService.isLoggedIn()) {
    this.router.navigate(['/home']);
  }
  }

  toggleMode() {
    this.mode.set(this.mode() === 'login' ? 'register' : 'login');
    this.error.set('');
  }

  login() {
    if (!this.nombreUsuario() || !this.password()) return;

    this.loading.set(true);
    this.error.set('');
    this.success.set('');

    this.usuarioService.login({
      nombreUsuario: this.nombreUsuario(),
      password: this.password()
    }).subscribe({
      next: res => {
        localStorage.setItem('token', res.token);
        this.loading.set(false);
        this.success.set('✅ Inicio de sesión exitoso');
        this.isLoggedIn.set(true); // ✅ ya está logueado

        // Esperar 1 segundo y redirigir al home
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000);
      },
      error: err => {
        console.error('Error login:', err);
        this.loading.set(false);
        this.error.set('❌ Usuario o contraseña incorrecta');
      }
    });
  }

  register() {
    const dto: UsuarioCreateDTO = {
      nombreUsuario: this.nombreUsuario(),
      password: this.password(),
      rol: this.rol(),
      empresaID: this.empresaID() ?? undefined
    };

    this.usuarioService.registrar(dto).subscribe({
      next: res => {
        console.log('Usuario registrado:', res);
        this.mode.set('login');
        this.success.set('✅ Usuario registrado, ahora inicia sesión');
        this.error.set('');
      },
      error: err => {
        console.error('Error registrando usuario', err);
        this.error.set('❌ No se pudo registrar el usuario.');
      }
    });
  }
}
