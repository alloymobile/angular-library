import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ButtonPageComponent } from './cell-page/button-page/button-page.component';
import { CellPageComponent } from './cell-page/cell-page.component';
import { IconButtonPageComponent } from './cell-page/icon-button-page/icon-button-page.component';
import { IconLinkPageComponent } from './cell-page/icon-link-page/icon-link-page.component';
import { IconPageComponent } from './cell-page/icon-page/icon-page.component';
import { InputPageComponent } from './cell-page/input-page/input-page.component';
import { LinkPageComponent } from './cell-page/link-page/link-page.component';
import { OrganPageComponent } from './organ-page/organ-page.component';
import { CrudPageComponent } from './organ-page/crud-page/crud-page.component';
import { ForgetPageComponent } from './organ-page/forget-page/forget-page.component';
import { LoginPageComponent } from './organ-page/login-page/login-page.component';
import { RegisterPageComponent } from './organ-page/register-page/register-page.component';
import { ResetPageComponent } from './organ-page/reset-page/reset-page.component';
import { TokenPageComponent } from './organ-page/token-page/token-page.component';
import { TableDetailPageComponent } from './table-detail-page/table-detail-page.component';
import { TissuePageComponent } from './tissue-page/tissue-page.component';
import { TablePageComponent } from './tissue-page/table-page/table-page.component';

const routes: Routes = [
  { path: '', component: CellPageComponent, children:
    [
      {path: '', component: IconPageComponent},
      {path: "icon-link",component:IconLinkPageComponent},
      {path: "icon-button",component:IconButtonPageComponent},
      {path: "link",component:LinkPageComponent},
      {path: "button",component:ButtonPageComponent},
      {path: "input",component:InputPageComponent}
    ]
  },
  { path: 'tissue', component: TissuePageComponent, children:
    [
      {path: "",component: TablePageComponent},
      {path: "table/:id",component: TableDetailPageComponent}
    ]
  },
  { path: 'organ', component: OrganPageComponent, children:
    [
      {path: "",component: LoginPageComponent},
      {path: "register",component: RegisterPageComponent},
      {path: "forget",component: ForgetPageComponent},
      {path: "reset",component: ResetPageComponent},
      {path: "token",component: TokenPageComponent},
      {path: "crud",component: CrudPageComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
