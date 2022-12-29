import { Table } from "../../tissue/table/table.model";
import { AlloyModal, AlloyModalFile, AlloyModalToast} from "../modal/modal.model";

 
 export class AlloyCrud{
    id: string;
    className: string;
    modal: AlloyModal;
    table: Table
    constructor(res?: any){
        if(res){
            this.id = res.id ? res.id : "";
            this.className = res.className ? res.className : "";
            this.modal = res.modal ? new AlloyModal(res.modal) : new AlloyModal();
            this.table = res.table ? new Table(res.table) : new Table();
        }else{
            this.id =  "";
            this.className = "";
            this.modal =  new AlloyModal();
            this.table =  new Table();
        }
    }
}

export class AlloyCrudFile{
    id: string;
    className: string;
    modalFile: AlloyModalFile;
    modalToast: AlloyModalToast;
    table: Table
    constructor(res?: any){
        if(res){
            this.id = res.id ? res.id : "";
            this.className = res.className ? res.className : "";
            this.modalFile = res.modalFile ? new AlloyModalFile(res.modalFile) : new AlloyModalFile();
            this.modalToast = res.modalToast ? new AlloyModalToast(res.modalToast) : new AlloyModalToast();
            this.table = res.table ? new Table(res.table) : new Table();
        }else{
            this.id =  "";
            this.className = "";
            this.modalFile =  new AlloyModalFile();
            this.modalToast = new AlloyModalToast();
            this.table =  new Table();
        }
    }
}