import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../core/i18n/translation.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'plra-reviewer-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reviewer-layout.html',
  styleUrls: ['./reviewer-layout.css']
})
export class ReviewerLayoutComponent {
  t = inject(TranslationService);
  auth = inject(AuthService);
}
