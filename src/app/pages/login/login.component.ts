import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
// --- 1. IMPORTA TU SERVICIO ---


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

  // --- 2. INYECTA EL SERVICIO EN EL CONSTRUCTOR ---
  constructor(
    private fb: FormBuilder,
    private authService: AuthService // Inyección de dependencias
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(128)]],
      remember: [false]
    });
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // --- 3. LLAMA AL SERVICIO CON LOS DATOS DEL FORMULARIO ---
    console.log('Formulario válido. Procediendo a llamar al servicio de autenticación...');

    // Creamos el objeto solo con los campos que la API necesita
    const credentials = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };
    
    // El servicio devuelve un Observable, por lo que debemos "suscribirnos" para que se ejecute.
    this.authService.login(credentials).subscribe({
      next: (response) => {
        // Esto se ejecuta si la llamada (simulada o real) es exitosa
        console.log('5. [LoginComponent] Respuesta recibida del servicio:', response);
        console.log('¡Login exitoso!');
        // Aquí, en el futuro, redirigirías al usuario a la página principal.
        // Por ejemplo: this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        // Esto se ejecuta si la API devuelve un error
        console.error('[LoginComponent] Error recibido del servicio:', error);
        // Aquí mostrarías un mensaje de error al usuario (ej: "Credenciales incorrectas")
      }
    });
  }
}