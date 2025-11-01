import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProductoService, Producto, ProductoDTO } from '../services/producto.service';

@Component({
  selector: 'app-productos-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './productos-list.component.html'
})
export class ProductosListComponent implements OnInit {
  private productoService = inject(ProductoService);

  productos: Producto[] = [];
  nuevoProducto: ProductoDTO = { nombre: '', descripcion: '', precio: 0, stock: 0 };
  editandoProductoId: number | null = null;

  mostrarFormulario: boolean = false; // Para el formulario colapsable
  loading: boolean = false;           // Para el spinner de carga

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.loading = true;
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos', err);
        this.loading = false;
      }
    });
  }

  guardarProducto(): void {
    if (!this.nuevoProducto.nombre || this.nuevoProducto.precio < 0 || this.nuevoProducto.stock < 0) return;

    if (this.editandoProductoId === null) {
      // Crear
      this.productoService.crearProducto(this.nuevoProducto).subscribe({
        next: (prod) => {
          this.productos.push(prod);
          this.resetFormulario();
          this.mostrarFormulario = false;
        },
        error: (err) => console.error('Error al crear producto', err)
      });
    } else {
      // Actualizar
      this.productoService.actualizarProducto(this.editandoProductoId, this.nuevoProducto).subscribe({
        next: () => {
          const index = this.productos.findIndex(p => p.productoID === this.editandoProductoId);
          if (index !== -1) {
            this.productos[index] = { ...this.productos[index], ...this.nuevoProducto };
          }
          this.resetFormulario();
          this.mostrarFormulario = false;
        },
        error: (err) => console.error('Error al actualizar producto', err)
      });
    }
  }

  editarProducto(producto: Producto): void {
    this.editandoProductoId = producto.productoID;
    this.nuevoProducto = {
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio,
      stock: producto.stock
    };
    this.mostrarFormulario = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminarProducto(id: number): void {
    if (!confirm('¿Deseas eliminar este producto?')) return;

    this.productoService.eliminarProducto(id).subscribe({
      next: () => this.productos = this.productos.filter(p => p.productoID !== id),
      error: (err) => console.error('Error al eliminar producto', err)
    });
  }

  resetFormulario(): void {
    this.nuevoProducto = { nombre: '', descripcion: '', precio: 0, stock: 0 };
    this.editandoProductoId = null;
  }
}
