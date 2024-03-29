import { AlloyInputType } from "../../cell/input/input.model";
import { AlloyButtonBar } from "../../tissue/bar/bar.model";
import { AlloyPay } from "../../tissue/pay/pay.model";

export class AlloyDonate{
    id: string;
    title: string;
    className: string;
    message: string;
    action: string;
    fields: AlloyInputType[];
    pay: AlloyPay;
    amountBar: AlloyButtonBar;
    data: any;
    constructor(res?: any){
        if(res){
            this.id = res.id ? res.id : "form";
            this.title = res.title ? res.title : "AlloyMobile";
            this.className = res.className ? res.className : "col m-2";
            this.message = res.message ? res.message : "";
            this.action = res.action ? res.action : "";
            this.fields = res.fields ? res.fields.map(f=>new AlloyInputType(f)) : [];
            this.pay = res.pay ? new AlloyPay(res.pay) : new AlloyPay();
            this.amountBar = res.amountBar ? new AlloyButtonBar(res.amountBar) : new AlloyButtonBar();
            this.data = {}
        }else{
            this.id =  "form";
            this.title = "AlloyMobile";
            this.className = "col m-2";
            this.message = "";
            this.action = "";
            this.fields = [];
            this.pay = new AlloyPay();
            this.amountBar = new AlloyButtonBar();
            this.data = {}
        }
    }
}
