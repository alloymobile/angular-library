import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlloyIcon } from '../../../cell/icon/icon.model';
import { AlloyLink } from '../../../cell/link/link.model';
import { Register } from '../register.model';

@Component({
  selector: 'alloy-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  _register: Register;
  registerForm: FormGroup;

  @Input() set register(register: Register){
    this._register = register;
  };
  loadingIcon = new AlloyIcon({id:5,icon:"faSpinner",size:"lg",spin:false,className:""});
  registerLink = new AlloyLink({id:1,name:"Sign up",className:"text-dark text-decoration-none d-flex flex-column align-items-center",link:"register",icon:{id:1,icon:"faUser",size:"2x",spin:false,className:""}});

  @Output() output: EventEmitter<Register> = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this._register = new Register();
  }

  // convenience getter for easy access to form fields
  get formControl() {
    return this.registerForm.controls;
  }

  ngOnInit(): void {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required,Validators.pattern(
        "(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@$!#^~%*?&,.<>\"'\\;:{\\}\\[\\]\\|\\+\\-\\=\\_\\)\\(\\)\\`\\/\\\\\\]])[A-Za-z0-9d$@].{7,}"
      )]],
      reTypePassword:['', [Validators.required,Validators.pattern(
        "(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@$!#^~%*?&,.<>\"'\\;:{\\}\\[\\]\\|\\+\\-\\=\\_\\)\\(\\)\\`\\/\\\\\\]])[A-Za-z0-9d$@].{7,}"
      )]]
    },{ validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('reTypePassword').value
       ? null : {'mismatch': true};
  }

  registerClient(){
    this._register.submitted = true;
    if (this.registerForm.valid) {
      this._register.submitted = false;
      this._register.error ="";
      this._register.name = this.formControl.name.value
      this._register.email = this.formControl.email.value;
      this._register.password = this.formControl.password.value;
      this._register.showSpinner = true;
      this.output.emit(this._register);
    }else{
      this._register.error = "There are form errors please fix them"
      this._register.showSpinner = false;
    }
  }
}
