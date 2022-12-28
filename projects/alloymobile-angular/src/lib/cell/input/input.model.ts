import { AlloyIcon } from "../icon/icon.model";

export class Input {
  id: string;
  name: string;
  type: string;
  className: string;
  placeholder: string;
  readonly: boolean;
  constructor(response?: any) {
    if (response) {
      this.id = response.id ? response.id : '';
      this.name = response.name ? response.name : 'name';
      this.type = response.type ? response.type : 'text';
      this.placeholder = response.placeholder ? response.placeholder : '';
      this.className = response.className ? response.className : 'input-group';
      this.readonly = response.readonly ? response.readonly : false;
    } else {
      this.id = '';
      this.name = 'name';
      this.type = '';
      this.placeholder = '';
      this.className = 'input-group';
      this.readonly = false;
    }
  }
}

export class AlloyInputText extends Input {
  text: string;
  label: string;
  constructor(response?: any) {
    if (response) {
      super(response);
      this.text = response.text ? response.text : '';
      this.label = response.label ? response.label : '';
    } else {
      super();
      this.text = '';
      this.label = '';
    }
  }
}

export class AlloyInputTextIcon extends AlloyInputText {
  icon: AlloyIcon;
  constructor(response?: any) {
    if (response) {
      super(response);
      this.icon = response.icon ? new AlloyIcon(response.icon) : new AlloyIcon();
    } else {
      super();
      this.icon = new AlloyIcon();
    }
  }
}


export class AlloyInputFile{

}

export class AlloyInputSelect{

}

export class AlloyInputTextarea{

}