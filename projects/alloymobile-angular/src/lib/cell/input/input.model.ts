import { AlloyIcon } from "../icon/icon.model";

export class Input {
  id: string;
  name: string;
  typeName: string;
  className: string;
  text: string;
  placeholder: string;
  constructor(response?: any) {
    if (response) {
      this.id = response.id ? response.id : '';
      this.name = response.name ? response.name : 'name';
      this.typeName = response.typeName ? response.typeName : '';
      this.text = response.text ? response.text : '';
      this.placeholder = response.placeholder ? response.placeholder : '';
      this.className = response.className ? response.className : 'input-group';
    } else {
      this.id = '';
      this.name = 'name';
      this.typeName = '';
      this.placeholder = '';
      this.text = '';
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

export class AlloyInputTextIcon extends Input {
  icon: AlloyIcon;
  iconClass: string;
  constructor(response?: any) {
    if (response) {
      super(response);
      this.iconClass = response.iconClass ? response.iconClass : '';
      this.placeholder = response.placeholder ? response.placeholder : '';
      this.icon = response.icon ? new AlloyIcon(response.icon) : new AlloyIcon();
    } else {
      super();
      this.iconClass = '';
      this.placeholder = '';
      this.icon = new AlloyIcon();
    }
  }
}

export class AlloyInputTextIconLabel extends Input {
  icon: AlloyIcon;
  iconClass: string;
  label: string;
  constructor(response?: any) {
    if (response) {
      super(response);
      this.iconClass = response.iconClass ? response.iconClass : '';
      this.icon = response.icon ? new AlloyIcon(response.icon) : new AlloyIcon();
      this.label = response.label ? response.label : '';
    } else {
      super();
      this.iconClass = '';
      this.icon = new AlloyIcon();
      this.label = '';
    }
  }
}

export class Input1 {
  id: string;
  name: string;
  typeName: string;
  className: string;
  label: string;
  constructor(response?: any) {
    if (response) {
      this.id = response.id ? response.id : '';
      this.name = response.name ? response.name : '';
      this.typeName = response.typeName ? response.typeName : '';
      this.className = response.className ? response.className : 'input-group';
      this.label = response.label ? response.label : '';
    } else {
      this.id = '';
      this.name = '';
      this.typeName = '';
      this.className = 'input-group';
      this.label = '';
    }
  }
}
