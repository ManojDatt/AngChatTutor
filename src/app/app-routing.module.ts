import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserWindowComponent } from './user-window/user-window.component';
import { UserGuard } from './user-guard';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: '', component: UserWindowComponent, pathMatch: "full", canActivate: [UserGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
