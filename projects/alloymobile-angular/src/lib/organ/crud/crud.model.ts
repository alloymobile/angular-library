import { Table } from "../../tissue/table/table.model";
import { AlloyInputModal} from "../modal/modal.model";

 
 export class AlloyCrud{
    id: string;
    className: string;
    modal: AlloyInputModal;
    table: Table
    constructor(res?: any){
        if(res){
            this.id = res.id ? res.id : "";
            this.className = res.className ? res.className : "";
            this.modal = res.modal ? new AlloyInputModal(res.modal) : new AlloyInputModal();
            this.table = res.table ? new Table(res.table) : new Table();
        }else{
            this.id =  "";
            this.className = "";
            this.modal =  new AlloyInputModal();
            this.table =  new Table();
        }
    }
}