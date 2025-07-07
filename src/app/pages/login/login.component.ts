import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router'; // <-- 1. IMPORTA EL ROUTER

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
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
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  // --- AÑADE ESTAS PROPIEDADES ---
  loading = false;
  apiError: string | null = null; // Para guardar el error que viene de la API

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router // <-- 3. INYECTA EL ROUTER
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(254)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(128)]],
      remember: [false]
    });
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit(): void {
    // Si hay un error de la API y el usuario intenta de nuevo, lo limpiamos
    this.apiError = null; 
    
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // --- ACTUALIZA EL ESTADO DE CARGA ---
    this.loading = true;

    const credentials = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };
    
    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.loading = false; // Detenemos la carga
        console.log('¡Login exitoso!', response);
        // Redirigimos al dashboard tras un login correcto
        this.router.navigate(['/dashboard']); 
      },
      error: (error) => {
        this.loading = false; // Detenemos la carga
        // --- ASIGNA EL MENSAJE DE ERROR A NUESTRA PROPIEDAD ---
        this.apiError = error.message; 
        console.error('[LoginComponent] Error recibido del servicio:', this.apiError);
      }
    });
  }
}