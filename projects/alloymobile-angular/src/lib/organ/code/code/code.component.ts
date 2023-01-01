import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlloyIcon } from '../../../cell/icon/icon.model';
import { AlloyLink, AlloyLinkIcon } from '../../../cell/link/link.model';
import { Code } from '../code.model';

@Component({
  selector: 'alloy-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.css']
})
export class CodeComponent {
  _code: Code;
  codeForm: FormGroup;
  loadingIcon = new AlloyIcon({id:5,icon:"faSpinner",size:"lg",spin:true,className:""});
  codeLink = new AlloyLinkIcon({id:1,name:"Code",className:"text-dark text-decoration-none d-flex flex-column align-items-center",link:"/code",icon:{id:1,icon:"faUser",size:"2x",spin:false,className:""}});
  loginLink = new AlloyLink({id:1,name:"Login",className:"text-dark text-decoration-none d-flex flex-column align-items-center",link:"/login"});

  @Input() set code(code: Code){
    this._code = code;
  };

  @Output() output: EventEmitter<Code> = new EventEmitter<Code>();

  constructor(private formBuilder: FormBuilder) {
    this._code = new Code();
  }

  // convenience getter for easy access to form fields
  get formControl() {
    return this.codeForm.controls;
  }

  ngOnInit(): void {
    this.createTokenForm();
  }

  createTokenForm() {
    this.codeForm = this.formBuilder.group({
      code: ['', [Validators.required]]
    });
  }

  codeClient(){
    this._code.submitted = true;
    if (this.codeForm.valid) {
      this._code.submitted = false;
      this._code.error ="";
      this._code.code = this.formControl.code.value;
      this._code.showSpinner = true;
      this.output.emit(this._code);
    }else{
      this._code.error = "There are form errors please fix them"
      this._code.showSpinner = false;
    }
  }
}
