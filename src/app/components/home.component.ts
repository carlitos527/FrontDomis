import { Component, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { EmpresaService } from '../services/empresa.service';
import { UsuarioService } from '../services/usuario.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: []
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private empresaService: EmpresaService, private usuarioService: UsuarioService) {}

  ngOnInit() {
  const token = localStorage.getItem('token');

  if (!token) {
    // si no hay sesión iniciada, mandamos al login
    this.router.navigate(['/usuarios']);
  } else {
    // si hay token, mostramos el home normalmente
 
  }
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
    this.router.navigate(['/usuarios']);
  }
}
