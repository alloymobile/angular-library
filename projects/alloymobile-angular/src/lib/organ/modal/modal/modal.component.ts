import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var window: any;
@Component({
  selector: 'alloy-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  formModal: any;
  //reactive form for data input
  dataForm: FormGroup;
 
  constructor(private formBuilder: FormBuilder) {}
 
  ngOnInit(): void {
    // this.createLoginForm();
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('myModal')
    );
  }
    // convenience getter for easy access to form fields
    get formControl() {
      return this.dataForm.controls;
    }

  // createLoginForm() {
  //   this.dataForm = this.formBuilder.group({
  //     name: ['', [Validators.required]]
  //   });
  // }
 
  openFormModal() {
    this.formModal.show();
  }
  submitData() {
    // confirm or save something
    this.formModal.hide();
    console.log(this.formControl.name.value)
  }
}