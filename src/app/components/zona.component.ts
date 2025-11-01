// zonas.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule,  DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';  
import { ZonaService, Zona } from '../services/zona.service';

@Component({
  selector: 'app-zonas',
  standalone: true,
  imports: [CommonModule, HttpClientModule,  FormsModule, DatePipe],
  templateUrl: './zonas.component.html', // <-- Aquí apuntamos al archivo HTML externo
  styleUrls: [] // o './zonas.component.css' si quieres estilos separados
})
export class ZonasComponent implements OnInit {
  zonas: Zona[] = [];
  loading = true;
   mostrarFormulario = false;
  nuevaZona: Zona = { nombre: '', tarifaEnvio: 0 };

  constructor(private zonaService: ZonaService) {}

 ngOnInit() {
    this.cargarZonas();
  }

  cargarZonas() {
    this.loading = true;
    this.zonaService.getAll().subscribe({
      next: data => {
        this.zonas = data;
        this.loading = false;
      },
      error: err => {
        console.error('Error al cargar zonas', err);
        this.loading = false;
      }
    });
  }

  crearZona() {
    this.zonaService.create(this.nuevaZona).subscribe({
      next: () => {
        this.nuevaZona = { nombre: '', tarifaEnvio: 0 };
        this.mostrarFormulario = false;
        this.cargarZonas();
      },
      error: err => console.error('Error al crear zona', err)
    });
  }

  eliminarZona(id?: number) {
    if (!id) return;
    if (confirm('¿Eliminar esta zona?')) {
      this.zonaService.delete(id).subscribe({
        next: () => this.cargarZonas(),
        error: err => console.error('Error al eliminar zona', err)
      });
    }
  }
}
