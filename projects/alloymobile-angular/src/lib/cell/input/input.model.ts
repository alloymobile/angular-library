import { AlloyIcon } from "../icon/icon.model";

export class Input {
  className: string;
  constructor(response?: any) {
    if (response) {
      this.className = response.className ? response.className : 'input-group';
    } else {
      this.className = 'input-group';
    }
  }
}

export class InputText extends Input {
  id: string;
  name: string;
  typeName: string;
  placeholder: string;
  text: string;
  label: string;
  constructor(response?: any) {
    if (response) {
      super(response);
      this.id = response.id ? response.id : '';
      this.name = response.name ? response.name : '';
      this.typeName = response.typeName ? response.typeName : '';
      this.placeholder = response.placeholder ? response.placeholder : '';
      this.text = response.text ? response.text : '';
      this.label = response.label ? response.label : '';
    } else {
      super();
      this.id = '';
      this.name = '';
      this.typeName = '';
      this.placeholder = '';
      this.text =  '';
      this.label = '';
    }
  }
}

export class InputTextIcon extends InputText {
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