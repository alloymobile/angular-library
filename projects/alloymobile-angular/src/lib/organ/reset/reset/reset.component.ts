import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlloyIcon } from '../../../cell/icon/icon.model';
import { AlloyLink, AlloyLinkIcon } from '../../../cell/link/link.model';
import { Reset } from '../reset.model';

@Component({
  selector: 'alloy-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent {
  _reset: Reset;
  resetForm: FormGroup;

  @Input() set reset(reset: Reset){
    this._reset = reset;
  };
  loadingIcon = new AlloyIcon({id:5,icon:"faSpinner",size:"lg",spin:true,className:""});
  resetLink = new AlloyLinkIcon({id:1,name:"Update Password",className:"text-dark text-decoration-none d-flex flex-column align-items-center",link:"/reset",icon:{id:1,icon:"faUser",size:"2x",spin:false,className:""}});
  clientType = ["","individual","corporate"]
  @Output() output: EventEmitter<Reset> = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this._reset = new Reset();
  }

  // convenience getter for easy access to form fields
  get formControl() {
    return this.resetForm.controls;
  }

  ngOnInit(): void {
    this.createResetForm();
  }

  createResetForm() {
    this.resetForm = this.formBuilder.group({
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

  resetPassword(){
    this._reset.submitted = true;
    if (this.resetForm.valid) {
      this._reset.submitted = false;
      this._reset.error ="";
      this._reset.password = this.formControl.password.value;
      this._reset.showSpinner = true;
      this.output.emit(this._reset);
    }else{
      this._reset.error = "There are form errors please fix them"
      this._reset.showSpinner = false;
    }
  }
}
