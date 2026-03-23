import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'plra-reviewer-pending', standalone: true, imports: [RouterModule],
  template: `<div class="alert alert-info"><i class="fa-solid fa-info-circle me-1"></i>Pending reviews are shown on each product's Review tab. <a routerLink="../uloc">Go to ULOC</a> or <a routerLink="../iloc">Go to ILOC</a>.</div>`
})
export class ReviewerPendingComponent {}
