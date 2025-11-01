import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmpresaService, Empresa } from '../services/empresa.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent implements OnInit {
  empresas = signal<Empresa[]>([]);
  nuevaEmpresa: Empresa = { nombre: '', direccion: '', telefono: '' };
  mostrarFormulario = signal(false);
  loading = signal(false);
  error = signal('');
  success = signal(''); // Mensaje de éxito

  constructor(private empresaService: EmpresaService, private router: Router) {}

  ngOnInit() {
    this.cargarEmpresas();
  }

  cargarEmpresas() {
  this.loading.set(true);
   this.error.set('');
    this.success.set('');
  
  this.empresaService.getAll().pipe(
    catchError(err => {
      console.error('Error al cargar empresas:', err);
      this.error.set('Error cargando empresas: ' + JSON.stringify(err));
      this.loading.set(false);
      return of([]); // Asegura que devuelva un Observable
    })
  ).subscribe(data => {
    this.empresas.set(data);
    this.loading.set(false);
     this.success.set('');
  });
}


  crearEmpresa() {
  if (!this.nuevaEmpresa.nombre) return;

   this.loading.set(true);
    this.error.set('');
    this.success.set('');

  this.empresaService.create(this.nuevaEmpresa).subscribe({
    next: (empresa) => {
      this.empresas.update(empresas => [...empresas, empresa]);
      this.nuevaEmpresa = { nombre: '', direccion: '', telefono: '' };
      this.mostrarFormulario.set(false);
        this.loading.set(false);
        this.success.set('Empresa creada correctamente 🎉');

      // Redirigir a formulario de usuario con empresaID
       setTimeout(() => {
        console.log('➡️ Redirigiendo a formulario de usuario...');
          this.success.set('');
      this.router.navigate(['/usuarios'], { queryParams: { empresaID: empresa.empresaID } });
    }, 1000);
  },
    error: (err) => {
        console.error('Error creando empresa:', err);
        this.loading.set(false);
        this.error.set('Error creando empresa 😢');
    }
  });

}


  eliminarEmpresa(id: number) {

    this.loading.set(true);
    this.error.set('');
    this.success.set('');

    this.empresaService.delete(id).subscribe({
      next: () => {
        this.empresas.update(empresas => empresas.filter(e => e.empresaID !== id));
        this.loading.set(false);
        this.success.set('Empresa eliminada correctamente');
        setTimeout(() => this.success.set(''), 1500); // limpiar mensaje
      },
      error: (err) => {
        console.error('Error eliminando empresa:', err);
        this.loading.set(false);
        this.error.set('Error eliminando empresa 😢');
      }
    });
  }
}
