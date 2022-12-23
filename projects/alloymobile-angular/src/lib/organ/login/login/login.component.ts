import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlloyIcon } from '../../../cell/icon/icon.model';
import { AlloyLink } from '../../../cell/link/link.model';
import { Login } from '../login.model';

@Component({
  selector: 'alloy-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  _login: Login;
  loginForm: FormGroup;
  loadingIcon = new AlloyIcon({id:5,icon:"faSpinner",size:"lg",spin:false,className:""});
  loginLink = new AlloyLink({id:1,name:"Sign in",className:"text-dark text-decoration-none d-flex flex-column align-items-center",link:"login",icon:{id:1,icon:"faRightToBracket",size:"2x",spin:false,className:""}});
  @Input() set login(login: Login){
    this._login = login;
  };

  @Output() output: EventEmitter<Login> = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this._login = new Login();
  }

  // convenience getter for easy access to form fields
  get formControl() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  loginClient(){
    this._login.submitted = true;
    if (this.loginForm.valid) {
      this._login.submitted = false;
      this._login.error ="";
      this._login.email = this.formControl.email.value;
      this._login.password = this.formControl.password.value;
      this.loadingIcon.spin = true;
      this.output.emit(this._login);
    }else{
      this._login.error = "There are form errors please fix them";
      this.loadingIcon.spin = false;
    }
  }
}
