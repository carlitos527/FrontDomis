import { Component, signal, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';

import { DomiciliariosService, Domiciliario, DomiciliarioDTO } from '../services/domiciliarios.service';
import { ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-domiciliarios',
  standalone: true,
  imports: [CommonModule, NgIf, ReactiveFormsModule], 
  templateUrl: './domiciliarios.component.html',
  styleUrls: ['./domiciliarios.component.css']
})
export class DomiciliariosComponent implements OnInit {

  domiciliarios = signal<Domiciliario[]>([]);
  form: FormGroup;
  editMode = signal(false);       // ahora es un signal
  editId: number | null = null;
  loading = signal(false);        // ahora es un signal
  mensaje = signal('');           // señal para mensajes de éxito o error

  constructor(
    private service: DomiciliariosService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      vehiculo: [''],
      estado: ['Disponible'],
      createdBy: ['Admin'] // Cambiar según tu usuario actual
    });
  }

  ngOnInit(): void {
    this.loadDomiciliarios();
  }

  loadDomiciliarios() {
    this.loading.set(true);
    this.service.getAll().subscribe({
      next: (data) => { 
        this.domiciliarios.set(data); 
        this.loading.set(false); 
      },
      error: (err) => { 
        console.error(err); 
        this.mensaje.set('Error cargando domiciliarios'); 
        this.loading.set(false); 
      }
    });
  }

  save() {
    if (this.form.invalid) return;

    const dto: DomiciliarioDTO = this.form.value;

    if (this.editMode() && this.editId) {
      dto.updatedBy = 'Admin';
      this.service.update(this.editId, dto).subscribe(() => {
        this.mensaje.set('Domiciliario actualizado correctamente');
        this.loadDomiciliarios();
        this.cancelEdit();
      });
    } else {
      this.service.create(dto).subscribe(() => {
        this.mensaje.set('Domiciliario creado correctamente');
        this.loadDomiciliarios();
        this.form.reset({ estado: 'Disponible', createdBy: 'Admin' });
      });
    }
  }

  edit(d: Domiciliario) {
    this.editMode.set(true);
    this.editId = d.domiciliarioID;
    this.form.patchValue({
      nombre: d.nombre,
      telefono: d.telefono,
      vehiculo: d.vehiculo,
      estado: d.estado,
      createdBy: d.createdBy
    });
  }

  cancelEdit() {
    this.editMode.set(false);
    this.editId = null;
    this.form.reset({ estado: 'Disponible', createdBy: 'Admin' });
  }

  delete(d: Domiciliario) {
    if (!confirm(`Eliminar domiciliario ${d.nombre}?`)) return;
    this.service.delete(d.domiciliarioID, 'Admin').subscribe(() => {
      this.mensaje.set('Domiciliario eliminado correctamente');
      this.loadDomiciliarios();
    });
  }
}
