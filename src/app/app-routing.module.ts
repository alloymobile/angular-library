import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ButtonPageComponent } from './cell/button-page/button-page.component';
import { IconPageComponent } from './cell/icon-page/icon-page.component';
import { LinkPageComponent } from './cell/link-page/link-page.component';
import { ForgetPageComponent } from './organ/forget-page/forget-page.component';
import { LoginPageComponent } from './organ/login-page/login-page.component';
import { RegisterPageComponent } from './organ/register-page/register-page.component';
import { TablePageComponent } from './tissue/table-page/table-page.component';

const routes: Routes = [
  {path:"icon",component:IconPageComponent},
  {path:"link",component:LinkPageComponent},
  {path:"button",component:ButtonPageComponent},
  {path: "login",component: LoginPageComponent},
  {path: "register",component: RegisterPageComponent},
  {path: "forget",component: ForgetPageComponent},
  {path: "table",component: TablePageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
