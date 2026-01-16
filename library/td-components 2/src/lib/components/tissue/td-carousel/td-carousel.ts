// src/lib/components/tissue/td-carousel/td-carousel.ts

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselObject, CarouselSlideObject } from './td-carousel.model';

@Component({
  selector: 'td-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './td-carousel.html',
  styleUrls: ['./td-carousel.css']
})
export class TdCarouselComponent implements OnInit, OnChanges {
  @Input() carousel!: CarouselObject;
  @Output() output = new EventEmitter<any>();

  activeIndex = 0;

  ngOnInit(): void { this.validateInput(); }
  ngOnChanges(changes: SimpleChanges): void { if (changes['carousel']) this.validateInput(); }

  private validateInput(): void {
    if (!this.carousel || !(this.carousel instanceof CarouselObject)) {
      throw new Error('TdCarouselComponent requires `carousel` prop (CarouselObject instance).');
    }
  }

  goToSlide(index: number): void {
    this.activeIndex = index;
    this.output.emit({ id: this.carousel.id, type: 'carousel', action: 'slide', data: { index } });
  }

  prev(): void {
    const newIndex = this.activeIndex > 0 ? this.activeIndex - 1 : this.carousel.slides.length - 1;
    this.goToSlide(newIndex);
  }

  next(): void {
    const newIndex = this.activeIndex < this.carousel.slides.length - 1 ? this.activeIndex + 1 : 0;
    this.goToSlide(newIndex);
  }

  trackBySlide(index: number, slide: CarouselSlideObject): string {
    return slide.id;
  }
}
