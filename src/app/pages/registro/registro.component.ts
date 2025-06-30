import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';




export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if (!control || !matchingControl) {
      return null;
    }

    // Si el otro control ya tiene un error de validación, no hacemos nada
    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
      return null;
    }

    // Establecer error en matchingControl si la validación falla
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }

    return null;
  };
}





@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
  
})



export class RegistroComponent implements OnInit{

  registerForm!: FormGroup;
  
  // Datos para el dropdown/select
  misOpciones = [
    { valor: 'gerente', texto: 'Gerente' },
    { valor: 'analista', texto: 'Analista' }
  ];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      rol: [null, Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  onRegisterSubmit(): void {
    // La comprobación de validez sigue siendo crucial
    if (this.registerForm.invalid) {
      console.log('Intento de envío de formulario no válido.');
      // Opcional: podrías marcar los campos para aplicarles estilos de error con CSS
      // this.registerForm.markAllAsTouched(); 
      return;
    }

    console.log('Formulario enviado con éxito!');
    const { confirmPassword, ...userData } = this.registerForm.value;
    console.log('Datos a enviar:', userData);

    // Aquí iría la lógica para llamar al servicio de registro
    // this.authService.register(userData).subscribe(...);
  }

  onCancel(): void {
    this.registerForm.reset();
    this.registerForm.patchValue({ rol: null });
  }

}

