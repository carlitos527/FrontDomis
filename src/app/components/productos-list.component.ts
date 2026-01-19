import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductoService, Producto, ProductoDTO } from '../services/producto.service';

@Component({
  selector: 'app-productos-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos-list.component.html'
})
export class ProductosListComponent implements OnInit {
  private productoService = inject(ProductoService);
  clienteEditandoID: number | null = null;
  modoEdicion = false;

  productos: Producto[] = [];
  nuevoProducto: ProductoDTO = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0
  };

  editandoProductoId: number | null = null;
  mostrarFormulario = false;
  loading = false;

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.loading = true;
    this.productoService.getProductos().subscribe({
      next: data => {
        this.productos = data;
        this.loading = false;
      },
      error: err => {
        console.error('Error al cargar productos', err);
        this.loading = false;
      }
    });
  }

  

  guardarProducto(): void {
    if (!this.nuevoProducto.nombre) return;

    this.loading = true;

    if (this.editandoProductoId === null) {
      // CREAR
      const productoCrear = {
        ...this.nuevoProducto,
        createdBy: 'Admin'
      };

      this.productoService.crearProducto(productoCrear).subscribe({
        next: prod => {
          this.productos.push(prod);
          this.resetFormulario();
          this.loading = false;
        },
        error: err => {
          console.error('Error al crear producto', err);
          this.loading = false;
        }
      });

    } else {
      // ACTUALIZAR
      const productoActualizar = {
        ...this.nuevoProducto,
        updatedBy: 'Admin'
      };

      this.productoService.actualizarProducto(this.editandoProductoId, productoActualizar).subscribe({
        next: () => {
          const index = this.productos.findIndex(
            p => p.productoID === this.editandoProductoId
          );

          if (index !== -1) {
            this.productos[index] = {
              ...this.productos[index],
              ...productoActualizar
            };
          }

          this.resetFormulario();
          this.loading = false;
        },
        error: err => {
          console.error('Error al actualizar producto', err);
          this.loading = false;
        }
      });
    }
  }

  editarProducto(producto: Producto): void {
    this.editandoProductoId = producto.productoID;
    this.nuevoProducto = {
      nombre: producto.nombre,
      descripcion: producto.descripcion ?? '',
      precio: producto.precio,
      stock: producto.stock
    };
    this.mostrarFormulario = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminarProducto(id: number): void {
    if (!confirm('¿Desea eliminar este producto?')) return;

    this.productoService.eliminarProducto(id).subscribe({
      next: () => {
        this.productos = this.productos.filter(p => p.productoID !== id);
      },
      error: err => console.error('Error al eliminar producto', err)
    });
  }

  resetFormulario(): void {
    this.nuevoProducto = {
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0
    };
    this.editandoProductoId = null;
    this.mostrarFormulario = false;
  }
}
