import { Table,TableAction } from "../../tissue/table/table.model";
import { AlloyModal, AlloyModalFile, AlloyModalToast} from "../modal/modal.model";

 
 export class AlloyCrud{
    id: string;
    className: string;
    modal: AlloyModal;
    table: TableAction
    constructor(res?: any){
        if(res){
            this.id = res.id ? res.id : "";
            this.className = res.className ? res.className : "";
            this.modal = res.modal ? new AlloyModal(res.modal) : new AlloyModal();
            this.table = res.table ? new TableAction(res.table) : new TableAction();
        }else{
            this.id =  "";
            this.className = "";
            this.modal =  new AlloyModal();
            this.table =  new TableAction();
        }
    }
}

export class AlloyCrudFile{
    id: string;
    className: string;
    table: Table
    constructor(res?: any){
        if(res){
            this.id = res.id ? res.id : "";
            this.className = res.className ? res.className : "";
            this.table = res.table ? new Table(res.table) : new Table();
        }else{
            this.id =  "";
            this.className = "";
            this.table =  new Table();
        }
    }
}

export class AlloyCrudFileAction extends AlloyCrudFile{
    modalFile: AlloyModalFile;
    modalToast: AlloyModalToast;
    constructor(res?: any){
        if(res){
            super(res);
            this.modalFile = res.modalFile ? new AlloyModalFile(res.modalFile) : new AlloyModalFile();
            this.modalToast = res.modalToast ? new AlloyModalToast(res.modalToast) : new AlloyModalToast();
        }else{
            super();
            this.modalFile =  new AlloyModalFile();
            this.modalToast = new AlloyModalToast();
        }
    }
}