import { AlloyButtonIcon } from "../../cell/button/button.model";
import { AlloyInputTextIcon } from "../../cell/input/input.model";

export class AlloySearchBar{
    id: string;
    className: string;
    search: AlloyInputTextIcon[];
    upload: AlloyButtonIcon;
    constructor(response?: any) {
        if (response) {
          this.id = response.id ? response.id : "";
          this.className = response.className ? response.className : '';
          this.search = response.search ? response.search.map(s=>new AlloyInputTextIcon(s)) : [];
          this.upload = response.upload ? new AlloyButtonIcon(response.upload) : new AlloyButtonIcon();
        } else {
          this.id = "";
          this.className = '';
          this.search = [];
          this.upload = new AlloyButtonIcon();
        }
    }
}