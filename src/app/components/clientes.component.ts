import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService, Cliente, ClienteDTO } from '../services/cliente.service';
import { ZonaService, Zona } from '../services/zona.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent {

  clientes: Cliente[] = [];
  zonas: Zona[] = [];
  loading = false;
  mostrarFormulario = false;



  nuevaCliente: ClienteDTO = {
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    ciudad: '',
    zonaID: undefined
  };

  // =========================
  // Formulario para editar cliente
  mostrarEditarFormulario = false;
  clienteEditandoID: number | null = null;
  clienteEditando: ClienteDTO = {
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    ciudad: '',
    zonaID: undefined
  };

  constructor(
    private clienteService: ClienteService,
    private zonaService: ZonaService
  ) {
    this.cargarClientes();
    this.cargarZonas();
  }

  cargarClientes() {
    this.loading = true;
    this.clienteService.getAll().subscribe({
      next: data => this.clientes = data,
      error: err => console.error(err),
      complete: () => this.loading = false
    });
  }

  cargarZonas() {
    this.zonaService.getAll().subscribe({
      next: data => this.zonas = data,
      error: err => console.error('Error al cargar zonas', err)
    });
  }

  // ✅ CREATE ARREGLADO
 crearCliente(): void {
  if (!this.nuevaCliente.zonaID) {
    alert('Debe seleccionar una zona');
    return;
  }

  // Agregar createdBy desde el token o localStorage
  this.nuevaCliente.createdBy = localStorage.getItem('user') || 'Admin';

  // Convertir zonaID a número por si llega como string
  this.nuevaCliente.zonaID = Number(this.nuevaCliente.zonaID);

  console.log('JSON enviado:', this.nuevaCliente);

  this.clienteService.create(this.nuevaCliente).subscribe({
    next: () => {
      this.cargarClientes();
      this.mostrarFormulario = false;
      this.resetFormulario();
    },
    error: err => console.error('Error al crear cliente', err)
  });
}

resetFormulario() {
  this.nuevaCliente = {
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    ciudad: '',
    zonaID: 0
  };
}

// =========================
  // EDITAR CLIENTE
  abrirEditarCliente(cliente: Cliente) {
    this.clienteEditandoID = cliente.clienteID;
    this.clienteEditando = {
      nombre: cliente.nombre,
      telefono: cliente.telefono,
      email: cliente.email,
      direccion: cliente.direccion,
      ciudad: cliente.ciudad,
      zonaID: cliente.zonaID
    };
    this.mostrarEditarFormulario = true;
  }

  guardarEdicion(): void {
    if (!this.clienteEditandoID) return;
    if (!this.clienteEditando.zonaID) {
      alert('Debe seleccionar una zona');
      return;
    }

    this.clienteEditando.zonaID = Number(this.clienteEditando.zonaID);

    this.clienteService.update(this.clienteEditandoID, this.clienteEditando).subscribe({
      next: () => {
        this.cargarClientes();
        this.cerrarEditarFormulario();
      },
      error: err => console.error('Error al editar cliente', err)
    });
  }

  cerrarEditarFormulario() {
    this.mostrarEditarFormulario = false;
    this.clienteEditandoID = null;
    this.clienteEditando = {
      nombre: '',
      telefono: '',
      email: '',
      direccion: '',
      ciudad: '',
      zonaID: undefined
    };
  }




  eliminarCliente(id: number) {
    if (!confirm('¿Desea eliminar este cliente?')) return;

    this.clienteService.delete(id).subscribe({
      next: () => {
        this.clientes = this.clientes.filter(c => c.clienteID !== id);
      },
      error: err => console.error(err)
    });
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }


  
}
