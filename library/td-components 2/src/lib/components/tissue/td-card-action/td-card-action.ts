// src/lib/components/tissue/td-card-action/td-card-action.ts
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardActionObject } from './td-card-action.model';
import { TdCardComponent } from '../td-card/td-card';
import { TdButtonBarComponent } from '../td-button-bar/td-button-bar';

@Component({
  selector: 'td-card-action',
  standalone: true,
  imports: [CommonModule, TdCardComponent, TdButtonBarComponent],
  templateUrl: './td-card-action.html',
  styleUrls: ['./td-card-action.css']
})
export class TdCardActionComponent implements OnInit, OnChanges {
  @Input() cardAction!: CardActionObject;
  @Output() output = new EventEmitter<any>();

  ngOnInit(): void { this.validateInput(); }
  ngOnChanges(changes: SimpleChanges): void { if (changes['cardAction']) this.validateInput(); }

  private validateInput(): void {
    if (!this.cardAction || !(this.cardAction instanceof CardActionObject)) {
      throw new Error('TdCardActionComponent requires `cardAction` prop (CardActionObject instance).');
    }
  }

  onCardOutput(out: any): void { this.output.emit(out); }
  onActionOutput(out: any): void { this.output.emit(out); }
}
