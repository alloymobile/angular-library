import { AlloyIcon } from "../icon/icon.model";

export class Input {
  id: string;
  name: string;
  typeName: string;
  className: string;
  placeholder: string;
  constructor(response?: any) {
    if (response) {
      this.id = response.id ? response.id : '';
      this.name = response.name ? response.name : 'name';
      this.typeName = response.typeName ? response.typeName : '';
      this.placeholder = response.placeholder ? response.placeholder : '';
      this.className = response.className ? response.className : 'input-group';
    } else {
      this.id = '';
      this.name = 'name';
      this.typeName = '';
      this.placeholder = '';
      this.className = 'input-group';
    }
  }
}

export class AlloyInputText extends Input {
  label: string;
  constructor(response?: any) {
    if (response) {
      super(response);
      this.label = response.label ? response.label : '';
    } else {
      super();
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
