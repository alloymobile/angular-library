export class Alloy{
    id: string;
    static idGenerator: number = 0;
    constructor(res?){
        if(res){
            this.id = res.constructor.name + ++Alloy.idGenerator;
        }
    }
}