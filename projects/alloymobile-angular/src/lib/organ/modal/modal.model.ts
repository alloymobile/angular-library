
export class AlloyModal{
    id: string;
    title: string;
    folderName: string;
    constructor(res?: any){
        if(res){
            this.id = res.id ? res.id : "";
            this.title = res.title ? res.title : "";
            this.folderName = res.folderName ? res.folderName : "";
        }else{
            this.id =  "";
            this.title = "";
            this.folderName = "";
        }
    }
}