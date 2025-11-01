import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PedidoService, PedidoDTO, PedidoDetalleDTO } from '../services/pedido.service';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './pedidos.component.html'
})
export class PedidosComponent implements OnInit {
  private pedidoService = inject(PedidoService);

  pedidos: PedidoDTO[] = [];
  mostrarFormulario = false;
  loading = false;

  nuevoPedido: PedidoDTO = {
    clienteID: 0,
    estado: 'Pendiente',
    fechaPedido: new Date().toISOString(),
    detalles: []
  };

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.loading = true;
    this.pedidoService.getPedidos().subscribe({
      next: data => {
        this.pedidos = data;
        this.loading = false;
      },
      error: err => {
        console.error('Error al cargar pedidos', err);
        this.loading = false;
      }
    });
  }

  guardarPedido(): void {
    if (!this.nuevoPedido.detalles.length) {
      alert('Debe agregar al menos un detalle de pedido.');
      return;
    }

    this.pedidoService.crearPedido(this.nuevoPedido).subscribe({
      next: pedido => {
        this.pedidos.push(pedido);
        this.resetFormulario();
      },
      error: err => console.error('Error al crear pedido', err)
    });
  }

  agregarDetalle(): void {
    this.nuevoPedido.detalles.push({ productoID: 0, cantidad: 1, precioUnitario: 0 });
  }

  eliminarDetalle(index: number): void {
    this.nuevoPedido.detalles.splice(index, 1);
  }

  eliminarPedido(clienteID: number): void {
    if (!confirm('¿Deseas eliminar este pedido?')) return;

    this.pedidoService.eliminarPedido(clienteID).subscribe({
      next: () => this.pedidos = this.pedidos.filter(p => p.clienteID !== clienteID),
      error: err => console.error('Error al eliminar pedido', err)
    });
  }

  resetFormulario(): void {
    this.nuevoPedido = { clienteID: 0, estado: 'Pendiente', fechaPedido: new Date().toISOString(), detalles: [] };
    this.mostrarFormulario = false;
  }
}
