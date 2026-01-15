// src/app/plra/pages/plra-home/plra-home.ts
import { Component } from '@angular/core';
import { TdIconObject } from '../../../lib/cell/td-icon/td-icon.model';

import plraHomeConfig from './plra-home.json';

@Component({
  selector: 'plra-home',
  standalone: false,
  templateUrl: './plra-home.html',
  styleUrl: './plra-home.css',
})
export class PlraHome {
  icon = new TdIconObject((plraHomeConfig as any).icon || {});
}
