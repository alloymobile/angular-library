import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlloyIcon } from '../../../cell/icon/icon.model';
import { AlloyLink, AlloyLinkIcon } from '../../../cell/link/link.model';
import { Forget } from '../forget.model';

@Component({
  selector: 'alloy-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.css']
})
export class ForgetComponent {
  _forget: Forget;
  forgetForm: FormGroup;
  loadingIcon = new AlloyIcon({id:5,icon:"faSpinner",size:"lg",spin:true,className:""});
  forgetLink = new AlloyLinkIcon({id:1,name:"Forget password",className:"text-dark text-decoration-none d-flex flex-column align-items-center",link:"/forget",icon:{id:1,icon:"faUser",size:"2x",spin:false,className:""}});
  loginLink = new AlloyLink({id:1,name:"Login",className:"text-dark text-decoration-none d-flex flex-column align-items-center",link:"/login"});

  @Input() set forget(forget: Forget){
    this._forget = forget;
  };

  @Output() output: EventEmitter<Forget> = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this._forget = new Forget();
  }

  // convenience getter for easy access to form fields
  get formControl() {
    return this.forgetForm.controls;
  }

  ngOnInit(): void {
    this.createForgetForm();
  }

  createForgetForm() {
    this.forgetForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]]
    });
  }

  forgetClient(){
    this._forget.submitted = true;
    if (this.forgetForm.valid) {
      this._forget.submitted = false;
      this._forget.error ="";
      this._forget.email = this.formControl.email.value;
      this._forget.showSpinner = true;
      this.output.emit(this._forget);
    }else{
      this._forget.error = "There are form errors please fix them"
      this._forget.showSpinner = false;
    }
  }
}
