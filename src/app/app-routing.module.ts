import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CargaComponent } from './pages/carga/carga.component';
import { ResumenComponent } from './pages/resumen/resumen.component';
import { RegistroComponent } from './pages/registro/registro.component';

const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' }, 
  { path: 'login', component: LoginComponent},
  { path: 'dashboard', component: DashboardComponent,
    children:[
      { path: '', redirectTo: 'resumen', pathMatch: 'full' }, 
      { path: 'resumen', component: ResumenComponent},
      { path: 'cargas', component: CargaComponent},
      { path: 'registro', component: RegistroComponent}
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
