import { Routes } from '@angular/router';
import {AuthGuard } from './components/auth.guard';
import {ClientesComponent } from './components/clientes.component';
import {DomiciliariosComponent } from './components/domiciliarios.component';
import {EmpresaComponent } from './components/empresa.component';
import {PagosComponent } from './components/pagos.component';
import {PedidosComponent } from './components/pedidos.component';
import { ProductosListComponent } from './components/productos-list.component'; // <-- importar 

import { ZonasComponent } from './components/zona.component';
import { HomeComponent } from './components/home.component';
import { AuthComponent } from './components/AuthComponent'; 

export const routes: Routes = [
  { path: '', redirectTo: 'usuarios', pathMatch: 'full' },

  { path: 'empresa', component: EmpresaComponent },
  { path: 'usuarios', component: AuthComponent }, // ruta para tu formulario de usuarios

   { path: 'home', component: HomeComponent, canActivate: [AuthGuard]  },

   { path: 'clientes', component: ClientesComponent },
   { path: 'domiciliarios', component: DomiciliariosComponent },   
   { path: 'pagos', component: PagosComponent },
    { path: 'pedidos', component: PedidosComponent },
   { path: 'productos', component: ProductosListComponent }, // <-- ruta para productos
   
  { path: 'zonas', component: ZonasComponent },
  { path: '**', redirectTo: '' }
];
