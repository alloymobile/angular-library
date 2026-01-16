// src/lib/components/tissue/td-image/td-image.ts

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageObject } from './td-image.model';

@Component({
  selector: 'td-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './td-image.html',
  styleUrls: ['./td-image.css']
})
export class TdImageComponent implements OnInit, OnChanges {
  @Input() image!: ImageObject;
  @Output() output = new EventEmitter<any>();

  currentSrc = '';
  hasError = false;

  ngOnInit(): void {
    this.validateInput();
    this.currentSrc = this.image.src;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['image']) {
      this.validateInput();
      this.currentSrc = this.image.src;
      this.hasError = false;
    }
  }

  private validateInput(): void {
    if (!this.image || !(this.image instanceof ImageObject)) {
      throw new Error('TdImageComponent requires `image` prop (ImageObject instance).');
    }
  }

  onError(): void {
    if (this.image.fallbackSrc && !this.hasError) {
      this.currentSrc = this.image.fallbackSrc;
      this.hasError = true;
    }
  }

  onClick(event: Event): void {
    this.output.emit({ id: this.image.id, type: 'image', action: 'click', event });
  }
}
