// src/demo/shell/td-demo-shell.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'td-demo-shell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './td-demo-shell.html',
  styleUrls: ['./td-demo-shell.css']
})
export class TdDemoShellComponent {}
