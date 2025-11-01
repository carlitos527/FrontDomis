import { Component, signal } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, // Hacemos que sea standalone
  imports: [RouterModule], // Importamos RouterModule para <router-outlet>
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  protected readonly title = signal('Frontdomis');

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('token'); // 🔹 Borra el token del usuario
    this.router.navigate(['/login']); // 🔹 Redirige al login
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

     goTopedidos() {
    this.router.navigate(['/pedidos']);
  }

    goToProductos() {
    this.router.navigate(['/productos']);
  }


   goTousuarios() {
    this.router.navigate(['/usuarios']);
  }

  goToZonas() {
    this.router.navigate(['/zonas']);
  }
}
