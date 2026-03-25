import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../core/i18n/translation.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'plra-viewer-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './viewer-layout.html',
  styleUrls: ['./viewer-layout.css']
})
export class ViewerLayoutComponent {
  t = inject(TranslationService);
  auth = inject(AuthService);
}
