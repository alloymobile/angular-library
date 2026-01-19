import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TdIcon } from './cell/td-icon/td-icon';
import { TdLink } from './cell/td-link/td-link';
import { TdButton } from './cell/td-button/td-button';
import { TdButtonIcon } from './cell/td-button-icon/td-button-icon';
import { TdButtonSubmit } from './cell/td-button-submit/td-button-submit';
import { TdLinkIcon } from './cell/td-link-icon/td-link-icon';
import { TdLinkLogo } from './cell/td-link-logo/td-link-logo';
import { TdInput } from './cell/td-input/td-input';
import { TdSearch } from './cell/td-search/td-search';
import { TdLoading } from './cell/td-loading/td-loading';
import { TdButtonBar } from './tissue/td-button-bar/td-button-bar';
import { TdLinkBar } from './tissue/td-link-bar/td-link-bar';
import { TdCard } from './tissue/td-card/td-card';
import { TdCardAction } from './tissue/td-card-action/td-card-action';
import { TdForm } from './tissue/td-form/td-form';
import { TdModal } from './tissue/td-modal/td-modal';
import { TdModalToast } from './tissue/td-modal-toast/td-modal-toast';
import { TdNavBar } from './tissue/td-nav-bar/td-nav-bar';
import { TdNavBarAction } from './tissue/td-nav-bar-action/td-nav-bar-action';
import { TdPagination } from './tissue/td-pagination/td-pagination';
import { TdSidebar } from './tissue/td-sidebar/td-sidebar';
import { TdTable } from './tissue/td-table/td-table';
import { TdTableAction } from './tissue/td-table-action/td-table-action';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TdIcon,
    TdLink,
    TdLinkIcon,
    TdLinkLogo,
    TdButton,
    TdButtonIcon,
    TdButtonSubmit,
    TdInput,
    TdSearch,
    TdLoading,
    TdButtonBar,
    TdLinkBar,
    TdCard,
    TdCardAction,
    TdForm,
    TdModal,
    TdModalToast,
    TdNavBar,
    TdNavBarAction,
    TdPagination,
    TdSidebar,
    TdTable,
    TdTableAction,
  ],
  exports:[
    TdIcon,
    TdLink,
    TdLinkIcon,
    TdLinkLogo,
    TdButton,
    TdButtonIcon,
    TdButtonSubmit,
    TdInput,
    TdSearch,
    TdLoading,
    TdButtonBar,
    TdLinkBar,
    TdButtonBar,
    TdLinkBar,
    TdCard,
    TdCardAction,
    TdForm,
    TdModal,
    TdModalToast,
    TdNavBar,
    TdNavBarAction,
    TdPagination,
    TdSidebar,
    TdTable,
    TdTableAction
  ]
})
export class LibModule { }
