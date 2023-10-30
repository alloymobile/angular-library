import { AlloyButtonIcon } from "../../cell/button/button.model";
import { AlloyInputTextIcon } from "../../cell/input/input.model";
import { TableAction } from "../../tissue/table/table.model";
import { AlloyModal } from "../modal/modal.model";

export class AlloyEmail{
    id: string;
    className: string;
    modal: AlloyModal;
    search: AlloyInputTextIcon;
    send: AlloyButtonIcon;
    table: TableAction;
    constructor(res?: any){
        if(res){
            this.id = res.id ? res.id : "";
            this.className = res.className ? res.className : "";
            this.modal = res.modal ? new AlloyModal(res.modal) : new AlloyModal();
            this.search = res.search ? new AlloyInputTextIcon(res.search) : new AlloyInputTextIcon();
            this.send = res.send ? new AlloyButtonIcon(res.send) : new AlloyButtonIcon();
            this.table = res.table ? new TableAction(res.table) : new TableAction();
        }else{
            this.id =  "";
            this.className = "";
            this.modal =  new AlloyModal();
            this.search =  new AlloyInputTextIcon();
            this.send =  new AlloyButtonIcon();
            this.table =  new TableAction();
        }
    }
}
