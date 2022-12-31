import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlloyIcon } from '../../../cell/icon/icon.model';
import { AlloyLink, AlloyLinkIcon } from '../../../cell/link/link.model';
import { Token } from '../token.model';

@Component({
  selector: 'alloy-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class TokenComponent {
  _token: Token;
  tokenForm: FormGroup;
  loadingIcon = new AlloyIcon({id:5,icon:"faSpinner",size:"lg",spin:true,className:""});
  tokenLink = new AlloyLinkIcon({id:1,name:"Code",className:"text-dark text-decoration-none d-flex flex-column align-items-center",link:"/token",icon:{id:1,icon:"faUser",size:"2x",spin:false,className:""}});
  loginLink = new AlloyLink({id:1,name:"Login",className:"text-dark text-decoration-none d-flex flex-column align-items-center",link:"/login"});

  @Input() set token(token: Token){
    this._token = token;
  };

  @Output() output: EventEmitter<Token> = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this._token = new Token();
  }

  // convenience getter for easy access to form fields
  get formControl() {
    return this.tokenForm.controls;
  }

  ngOnInit(): void {
    this.createTokenForm();
  }

  createTokenForm() {
    this.tokenForm = this.formBuilder.group({
      token: ['', [Validators.required]]
    });
  }

  tokenClient(){
    this._token.submitted = true;
    if (this.tokenForm.valid) {
      this._token.submitted = false;
      this._token.error ="";
      this._token.token = this.formControl.token.value;
      this._token.showSpinner = true;
      this.output.emit(this._token);
    }else{
      this._token.error = "There are form errors please fix them"
      this._token.showSpinner = false;
    }
  }
}
