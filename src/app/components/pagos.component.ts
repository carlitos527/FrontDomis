// src/app/components/pagos/pagos.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagoDTO, PagoService } from '../services/pago.service';

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})
export class PagosComponent {
  pagos: PagoDTO[] = [];
  mostrarFormulario = false;
  loading = false;

  nuevoPago: PagoDTO = {
    pedidoID: 0,
    metodoPago: '',
    monto: 0,
    estado: 'Pendiente'
  };

  constructor(private pagoService: PagoService) {
    this.cargarPagos();
  }

  cargarPagos(pedidoId: number = 0) {
    this.loading = true;
    if (pedidoId > 0) {
      this.pagoService.getPagosPorPedido(pedidoId).subscribe({
        next: (data) => { this.pagos = data; this.loading = false; },
        error: () => { this.loading = false; }
      });
    } else {
      this.pagos = [];
      this.loading = false;
    }
  }

  guardarPago() {
    this.pagoService.crearPago(this.nuevoPago).subscribe({
      next: (data) => {
        this.pagos.unshift(data);
        this.nuevoPago = { pedidoID: 0, metodoPago: '', monto: 0, estado: 'Pendiente' };
        this.mostrarFormulario = false;
      },
      error: (err) => console.error(err)
    });
  }

  eliminarPago(pagoId: number) {
    if (!confirm('¿Desea eliminar este pago?')) return;

    this.pagoService.eliminarPago(pagoId).subscribe({
      next: () => this.pagos = this.pagos.filter(p => p.pagoID !== pagoId),
      error: (err) => console.error(err)
    });
  }
}
