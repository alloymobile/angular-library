import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ButtonPageComponent } from './cell/button-page/button-page.component';
import { IconPageComponent } from './cell/icon-page/icon-page.component';
import { InputPageComponent } from './cell/input-page/input-page.component';
import { LinkPageComponent } from './cell/link-page/link-page.component';
import { CrudPageComponent } from './organ/crud-page/crud-page.component';
import { ForgetPageComponent } from './organ/forget-page/forget-page.component';
import { LoginPageComponent } from './organ/login-page/login-page.component';
import { RegisterPageComponent } from './organ/register-page/register-page.component';
import { ResetPageComponent } from './organ/reset-page/reset-page.component';
import { TokenPageComponent } from './organ/token-page/token-page.component';
import { TableDetailPageComponent } from './table-detail-page/table-detail-page.component';
import { TablePageComponent } from './tissue/table-page/table-page.component';

const routes: Routes = [
  {path: "icon",component:IconPageComponent},
  {path: "link",component:LinkPageComponent},
  {path: "button",component:ButtonPageComponent},
  {path: "input",component:InputPageComponent},
  {path: "login",component: LoginPageComponent},
  {path: "register",component: RegisterPageComponent},
  {path: "forget",component: ForgetPageComponent},
  {path: "reset",component: ResetPageComponent},
  {path: "token",component: TokenPageComponent},
  {path: "crud",component: CrudPageComponent},
  {path: "table",component: TablePageComponent},
  {path: "table/:id",component: TableDetailPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
