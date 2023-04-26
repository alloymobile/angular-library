import { AlloyIcon } from "../icon/icon.model";
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export class Input {
  id: string;
  name: string;
  type: string;
  className: string;
  placeholder: string;
  readonly: boolean;
  validators: [];
  errors: AlloyValidation[];
  //Only matches password and confirmPassword please update for generic
  match: boolean;
  constructor(res?: any) {
    if (res) {
      this.id = res.id ? res.id : 'input';
      this.name = res.name ? res.name : 'name';
      this.type = res.type ? res.type : 'text';
      this.placeholder = res.placeholder ? res.placeholder : '';
      this.className = res.className ? res.className : 'input-group';
      this.readonly = res.readonly ? res.readonly : false;
      this.match = res.match ? res.match : false;
      this.errors =  res.errors ? res.errors.map((res: AlloyCustomValidation)=> new AlloyCustomValidation(res)) : []; 
      this.validators =  res.errors ? res.errors.map((res: AlloyCustomValidation)=>  getValidator(new AlloyCustomValidation(res))) : []; 
    } else {
      this.id = 'input';
      this.name = 'name';
      this.type = 'text';
      this.placeholder = '';
      this.className = 'input-group';
      this.readonly = false;
      this.match = false;
      this.errors = [];
      this.validators = [];
    }
  }
}

export class AlloyInputText extends Input {
  text: string;
  label: string;
  options: String[];
  constructor(res?: any) {
    if (res) {
      super(res);
      this.text = res.text ? res.text : '';
      this.label = res.label ? res.label : 'Name';
      this.options = res.options ? res.options : [];
    } else {
      super();
      this.text = '';
      this.label = 'Name';
      this.options = [];
    }
  }
}

export class AlloyInputTextIcon extends AlloyInputText {
  icon: AlloyIcon;
  constructor(res?: any) {
    if (res) {
      super(res);
      this.icon = res.icon ?  this.getIcon(res.icon) : new AlloyIcon();
    } else {
      super();
      this.icon = new AlloyIcon();
    }
  }

  getIcon(icon){
    if(icon instanceof AlloyIcon){
      return icon;
    }else{
      return( new AlloyIcon(icon));
    }
  }
}

export class AlloyInputTextArea extends AlloyInputText{
  height: string;
  constructor(res?: any) {
    if (res) {
      super(res);
      this.height = res.height ? res.height : '100px';
    } else {
      super();
      this.height = '100px';
    }
  }
}


export class AlloyInputCheck extends AlloyInputText{
  constructor(res?: any) {
    if (res) {
      super(res);
    } else {
      super();
    }
  }
}

export class AlloyInputRadio extends AlloyInputText{
  constructor(res?: any) {
    if (res) {
      super(res);
    } else {
      super();
    }
  }
}

export class AlloyInputSelect extends AlloyInputText{
  options: String[];
  constructor(res?: any) {
    if (res) {
      super(res);
      this.options = res.options ? res.options : [];
    } else {
      super();
      this.options = [];
    }
  }
}

export const InputName: any = {
  AlloyInputTextIcon,
  AlloyInputTextArea,
  AlloyInputSelect,
  AlloyInputCheck,
  AlloyInputRadio
};

export class AlloyInput {
  constructor(input: string, opts?: any) {
    let className = getInputClass(input);
    if (InputName[className] === undefined || InputName[className] === null) {
      throw new Error(`Class type of \'${className}\' is not a table`);
    }
    if (opts) {
      return new InputName[className](opts);
    } else {
      return new InputName[className]();
    }
  }
}

export function getInputClass(input: string): string{
  switch(input){
    case 'text'||'email'||'password'||'date'||'number'||'file':
      return 'AlloyInputTextIcon';
    case 'textarea':
      return 'AlloyInputTextArea';  
    case 'select':
      return 'AlloyInputSelect';
    case 'checkbox':
      return 'AlloyInputCheck';
    case 'radio':
      return 'AlloyInputRadio';   
    default:
      return 'AlloyInputTextIcon';
  }
}

/*---------------------------Validation-----------------*/
export function getValidator(validator: AlloyCustomValidation){
  switch(validator.name){
    case "required":
      return Validators.required;
    case "email":
      return Validators.email;
    case "minLength":
      return Validators.minLength(Number(validator.pattern)); 
    case "maxLength":
      return Validators.maxLength(Number(validator.pattern));
    case "pattern":
      return Validators.pattern(validator.pattern); 
    case "custom":
      switch (validator.type){
        case "passwordStrength":
          return passwordStrengthValidator();
        default:
          return Validators.required; 
      }
    default:
      return Validators.required;   
  }
}

export function matchValidator(control: AbstractControl): ValidatorFn {
  const password: string = control.get("password").value; // get password from our password form control
  const confirmPassword: string = control.get("confirmPassword").value; // get password from our confirmPassword form control
  
  // if the confirmPassword value is null or empty, don't return an error.
  if (!confirmPassword?.length) {
    return null;
  }
  // compare the passwords and see if they match.
  if (password !== confirmPassword) {
    let errors = {};
    if(control.get("confirmPassword").errors != undefined){
      errors = control.get("confirmPassword").errors;
    }
    errors["mismatch"] = true;
    control.get("confirmPassword").setErrors(errors);
  } else {
    // if passwords match, don't return an error.
    return null;
  }
}

export function passwordStrengthValidator(): ValidatorFn {
  return (control:AbstractControl) : ValidationErrors | null => {
      const value = control.value;
      if (!value) {
          return null;
      }
      const hasUpperCase = /[A-Z]+/.test(value);
      const hasLowerCase = /[a-z]+/.test(value);
      const hasNumeric = /[0-9]+/.test(value);
      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;
      return !passwordValid ? {custom:true}: null;
  }
}

export class AlloyValidation{
  name: string;
  message: string;
  constructor(res?: any) {
    if (res) {
      this.name = res.name ? res.name : 'required';
      this.message = res.message ? res.message : 'Name is required';
    } else {
      this.name = 'required';
      this.message = 'Name is required';
    }
  }
}

export class AlloyPatternValidation extends AlloyValidation{
  pattern: string;
  constructor(res?: any) {
    if (res) {
      super(res);
      this.pattern = res.pattern ? res.pattern : '';
    } else {
      super();
      this.pattern = '';
    }
  }
}

export class AlloyCustomValidation extends AlloyPatternValidation{
  type: string;
  constructor(res?: any) {
    if (res) {
      super(res);
      this.type = res.type ? res.type : '';
    } else {
      super();
      this.type = '';
    }
  }
}
