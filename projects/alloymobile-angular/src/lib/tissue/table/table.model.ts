
export class Table{
    id: string;
    className: string;
    name: string;
    rows: Row[];
    link: string;
    constructor(response?: any){
      if(response){
        this.id = response.id ? response.id : "";
        this.className = response.className ? response.className : "table";
        this.name = response.name ? response.name : "";
        this.rows = response.rows ? response.rows.map((r) => new Row(r)) : [];
        this.link = response.link ? response.link : "";
      }else{
        this.id = "";
        this.name = "";
        this.className = 'table';
        this.rows = [];
       this.link = "";
      }
    }
}

export class Row{
    id: string;
    name: string;
    constructor(response?: any){
      if(response){
        this.id = response.id ? response.id : "";
        this.name = response.name ? response.name : "";
      }else{
        this.id = "";
        this.name = "";
      }
    }
}