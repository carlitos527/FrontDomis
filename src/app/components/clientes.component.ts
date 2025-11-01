import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService, Cliente, ClienteDTO } from '../services/cliente.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent {
  clientes = signal<Cliente[]>([]);
  loading = signal(false);
  mostrarFormulario = signal(false);

  nuevaCliente = signal<ClienteDTO>({
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    ciudad: '',
    zonaID: undefined
  });

  constructor(private clienteService: ClienteService) {
    this.cargarClientes();
  }

  cargarClientes() {
    this.loading.set(true);
    this.clienteService.getAll().subscribe({
      next: (data) => this.clientes.set(data),
      error: (err) => console.error(err),
      complete: () => this.loading.set(false)
    });
  }

  crearCliente() {
    const cliente = this.nuevaCliente();
    this.clienteService.create(cliente).subscribe({
      next: (c) => {
        this.clientes.update(list => [...list, c]);
        this.nuevaCliente.set({
          nombre: '',
          telefono: '',
          email: '',
          direccion: '',
          ciudad: '',
          zonaID: undefined
        });
        this.mostrarFormulario.set(false);
      },
      error: (err) => console.error(err)
    });
  }

  eliminarCliente(id: number) {
    if (!confirm('¿Desea eliminar este cliente?')) return;
    this.clienteService.delete(id).subscribe({
      next: () => this.clientes.update(list => list.filter(c => c.clienteID !== id)),
      error: (err) => console.error(err)
    });
  }
  toggleFormulario() {
  this.mostrarFormulario.update(v => !v);
}

}
