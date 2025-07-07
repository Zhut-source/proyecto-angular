// En: registro.component.ts
// COPIA Y PEGA EL CÓDIGO COMPLETO EN TU ARCHIVO

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// --- 1. ASEGÚRATE DE TENER ESTOS IMPORTS PARA LAS ANIMACIONES ---
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { RegistroService } from 'src/app/services/registro.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoleDto } from 'src/app/models/role.model';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  // --- 2. ¡AQUÍ ESTÁ LA CAUSA PROBABLE! ---
  // Esta propiedad 'animations' debe estar presente y no comentada.
  animations: [
    trigger('errorAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class RegistroComponent implements OnInit {

  registerForm!: FormGroup;
  loading = false;
  apiError: string | null = null;
  successMessage: string | null = null;
  roles$!: Observable<RoleDto[]>;

  generos = [
    { value: 'Masculino', label: 'Masculino' },
    { value: 'Femenino', label: 'Femenino' },
    { value: 'Otro', label: 'Otro' }
  ];
  
  estados = [
    { value: true, label: 'Activo' },
    { value: false, label: 'Inactivo' }
  ];

  constructor(
    private fb: FormBuilder,
    private registroService: RegistroService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadRoles();
    // En el futuro, aquí también cargarías la lista inicial de usuarios.
    // this.loadUsers(); 
  }
  
  loadRoles(): void {
    this.roles$ = this.registroService.getRoles().pipe(
      map(response => response.data)
    );
  }

  initializeForm(): void {
    this.registerForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.maxLength(50)]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      genero: [null, Validators.required],
      rol: [null, Validators.required],
      estado: [true],
      creadoPor: [{ value: 'Admin', disabled: true }]
    });
  }

  get f() { return this.registerForm.controls; }
  
  onSubmit(): void {
    this.apiError = null;
    this.successMessage = null;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const userData = this.registerForm.getRawValue(); 
    
    this.registroService.register(userData).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = response.message;
        console.log('[EXITO] Respuesta del servicio:', response);
        
        // === ¡ESTA ES LA LÓGICA CORREGIDA! ===

        // 1. Limpiamos y reiniciamos el formulario a su estado original
        this.registerForm.reset();
        this.initializeForm(); // Lo re-inicializamos para restaurar valores por defecto

        // 2. (Futuro) Aquí llamarías al método para recargar la lista de usuarios
        //    y que el nuevo registro aparezca en la tabla.
        //    this.loadUsers(); 

        // 3. (Opcional) Hacemos que el mensaje de éxito desaparezca después de 3 segundos
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);

        // 4. YA NO HAY REDIRECCIÓN. Nos quedamos en la misma página.
        //    La línea this.router.navigate(...) ha sido eliminada.
      },
      error: (error) => {
        this.loading = false;
        this.apiError = error.message;
        console.error('[ERROR] Error del servicio:', error);
      }
    });
  }
  
  onCancel(): void {
    // El botón de cancelar podría simplemente limpiar el formulario
    this.registerForm.reset();
    this.initializeForm();
    this.apiError = null;
    this.successMessage = null;
    
    // O si quieres que te lleve a otra parte, por ejemplo, al resumen del dashboard:
    // this.router.navigate(['/dashboard/resumen']);
  }
}