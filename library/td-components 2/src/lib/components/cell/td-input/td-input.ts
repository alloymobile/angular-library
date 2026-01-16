// src/lib/components/cell/td-input/td-input.ts

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputObject } from './td-input.model';
import { TdIconComponent } from '../td-icon/td-icon';
import { OutputObject } from '../../../utils/id-helper';

/**
 * TdInputComponent
 * 
 * Supports multiple input types:
 * - text, email, password, number, date, time, datetime-local
 * - textarea, select, multiselect
 * - radio, checkbox, switch
 * - file, canvas (signature)
 */
@Component({
  selector: 'td-input',
  standalone: true,
  imports: [CommonModule, FormsModule, TdIconComponent],
  templateUrl: './td-input.html',
  styleUrls: ['./td-input.css']
})
export class TdInputComponent implements OnInit, OnChanges, AfterViewInit {
  /**
   * Input: InputObject instance (required)
   */
  @Input() input!: InputObject;

  /**
   * Output: Emits OutputObject on change/blur
   */
  @Output() output = new EventEmitter<OutputObject>();

  @ViewChild('canvasEl') canvasEl!: ElementRef<HTMLCanvasElement>;

  // Internal state
  val: any;
  touched = false;
  errors: string[] = [];

  // Multiselect state
  msOpen = false;
  msQuery = '';

  // Canvas state
  private drawing = false;
  private lastPoint = { x: 0, y: 0 };
  private hasDrawn = false;

  ngOnInit(): void {
    this.validateInput();
    this.val = this.input.value;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['input']) {
      this.validateInput();
      this.val = this.input.value;
      this.touched = false;
      this.errors = [];
      this.msOpen = false;
      this.msQuery = '';
    }
  }

  ngAfterViewInit(): void {
    if (this.input.type === 'canvas') {
      this.initCanvas();
      if (this.val && typeof this.val === 'string' && this.val.startsWith('data:')) {
        this.drawCanvasDataUrl(this.val);
      }
    }
  }

  private validateInput(): void {
    if (!this.input || !(this.input instanceof InputObject)) {
      throw new Error('TdInputComponent requires `input` prop (InputObject instance).');
    }
  }

  /**
   * Get wrapper class
   */
  get wrapClass(): string {
    return this.input.colClass || 'col-12 col-md-6 mx-auto';
  }

  /**
   * Get input class with invalid state
   */
  get inputClassWithInvalid(): string {
    const showError = this.touched && this.errors.length > 0;
    return showError ? `${this.input.className} is-invalid` : this.input.className;
  }

  /**
   * Check if should show error
   */
  get showError(): boolean {
    return this.touched && this.errors.length > 0;
  }

  /**
   * Check if should show label (for certain types)
   */
  get shouldShowLabel(): boolean {
    const labelTypes = ['text', 'textarea', 'number', 'email', 'password', 'date', 
      'datetime-local', 'time', 'file', 'canvas', 'select', 'multiselect'];
    return labelTypes.includes(this.input.type) && !!this.input.label;
  }

  /**
   * Canvas dimensions
   */
  get canvasWidth(): number {
    return this.input.width ?? 420;
  }

  get canvasHeight(): number {
    return this.input.height ?? 180;
  }

  get strokeWidth(): number {
    return this.input.canvasStrokeWidth ?? 2;
  }

  // ==================== Validation ====================

  private validate(): void {
    this.errors = [];

    // Required validation
    if (this.input.required) {
      if (this.input.type === 'checkbox') {
        const arrVal = Array.isArray(this.val) ? this.val : [];
        if (arrVal.length === 0) {
          this.errors.push('This field is required.');
        }
      } else {
        const empty = this.val === '' || this.val === false || 
          this.val === undefined || this.val === null;
        if (empty) {
          this.errors.push('This field is required.');
        }
      }
    }

    if (this.errors.length > 0) return;

    // MinLength validation
    if (typeof this.input.minLength === 'number' && 
        typeof this.val === 'string' && 
        this.val.length < this.input.minLength) {
      this.errors.push(`Minimum length is ${this.input.minLength}`);
    }

    // MaxLength validation
    if (typeof this.input.maxLength === 'number' && 
        typeof this.val === 'string' && 
        this.val.length > this.input.maxLength) {
      this.errors.push(`Maximum length is ${this.input.maxLength}`);
    }

    // Pattern validation
    if (this.input.pattern && typeof this.val === 'string') {
      const regex = new RegExp(this.input.pattern);
      if (!regex.test(this.val)) {
        this.errors.push('Invalid format.');
      }
    }

    // Password strength validation
    if (this.input.passwordStrength && typeof this.val === 'string') {
      const strongRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/;
      if (!strongRegex.test(this.val)) {
        this.errors.push('Password is too weak.');
      }
    }

    // Custom validators
    if (this.input.validators && this.input.validators.length > 0) {
      for (const validator of this.input.validators) {
        const error = validator(this.val);
        if (error) {
          this.errors.push(error);
          break;
        }
      }
    }
  }

  // ==================== Event Handlers ====================

  private emit(action: string): void {
    this.validate();

    const out = new OutputObject({
      id: this.input.id,
      type: 'input',
      action,
      error: this.errors.length > 0,
      errorMessage: this.errors,
      data: {
        name: this.input.name,
        value: this.val,
        valid: this.errors.length === 0,
        errors: this.errors
      }
    });

    this.output.emit(out);
  }

  onChange(event?: Event): void {
    this.emit('change');
  }

  onBlur(event?: Event): void {
    this.touched = true;
    this.emit('blur');
  }

  onRadioChange(value: string): void {
    this.val = value;
    this.onChange();
  }

  onCheckboxChange(value: string, checked: boolean): void {
    if (!Array.isArray(this.val)) {
      this.val = [];
    }
    if (checked) {
      if (!this.val.includes(value)) {
        this.val = [...this.val, value];
      }
    } else {
      this.val = this.val.filter((v: string) => v !== value);
    }
    this.onChange();
  }

  onSwitchChange(checked: boolean): void {
    this.val = checked;
    this.onChange();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    if (this.input.multiple) {
      this.val = Array.from(input.files);
    } else {
      this.val = input.files[0] || null;
    }
    this.onChange();
  }

  // ==================== Multiselect ====================

  isSelected(value: string): boolean {
    return Array.isArray(this.val) && this.val.includes(value);
  }

  toggleOption(value: string): void {
    if (!Array.isArray(this.val)) {
      this.val = [];
    }
    if (this.val.includes(value)) {
      this.val = this.val.filter((v: string) => v !== value);
    } else {
      this.val = [...this.val, value];
    }
    this.onChange();
  }

  get filteredOptions(): any[] {
    if (!this.msQuery) return this.input.options;
    const query = this.msQuery.toLowerCase();
    return this.input.options.filter(opt => 
      opt.label.toLowerCase().includes(query)
    );
  }

  // ==================== Canvas Methods ====================

  private initCanvas(): void {
    const canvas = this.canvasEl?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = this.strokeWidth;
    ctx.strokeStyle = '#000';
  }

  private clearCanvasSurface(): void {
    const canvas = this.canvasEl?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  private drawCanvasDataUrl(dataUrl: string): void {
    const canvas = this.canvasEl?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      this.clearCanvasSurface();
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      this.initCanvas();
    };
    img.src = dataUrl;
  }

  private getCanvasDataUrl(): string {
    const canvas = this.canvasEl?.nativeElement;
    if (!canvas) return '';
    return canvas.toDataURL('image/png');
  }

  private getPoint(e: MouseEvent | TouchEvent): { x: number; y: number } {
    const canvas = this.canvasEl?.nativeElement;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }

    return {
      x: (e as MouseEvent).clientX - rect.left,
      y: (e as MouseEvent).clientY - rect.top
    };
  }

  private drawLine(from: { x: number; y: number }, to: { x: number; y: number }): void {
    const canvas = this.canvasEl?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }

  onCanvasStart(e: MouseEvent | TouchEvent): void {
    if (this.input.disabled) return;
    e.preventDefault();

    this.drawing = true;
    const p = this.getPoint(e);
    this.lastPoint = p;
    this.hasDrawn = true;
    this.drawLine(p, p);
  }

  onCanvasMove(e: MouseEvent | TouchEvent): void {
    if (this.input.disabled) return;
    if (!this.drawing) return;
    e.preventDefault();

    this.hasDrawn = true;
    const p = this.getPoint(e);
    this.drawLine(this.lastPoint, p);
    this.lastPoint = p;
  }

  onCanvasEnd(): void {
    if (this.input.disabled) return;
    if (!this.drawing) return;

    this.drawing = false;
    const next = this.hasDrawn ? this.getCanvasDataUrl() : '';
    this.val = next;
    this.emit('change');
  }

  clearCanvas(): void {
    this.clearCanvasSurface();
    this.initCanvas();
    this.hasDrawn = false;
    this.val = '';
    this.emit('change');
  }

  // ==================== File Preview ====================

  getFilePreview(): string {
    if (!this.val) return '';

    if (typeof this.val === 'string') {
      return this.val;
    }

    if (this.val instanceof File) {
      return `${this.val.name} (${Math.round(this.val.size / 1024)} KB)`;
    }

    if (Array.isArray(this.val)) {
      if (this.val.every((x: any) => typeof x === 'string')) {
        return this.val.join(', ');
      }
      if (this.val.every((x: any) => x instanceof File)) {
        return this.val.map((f: File) => `${f.name} (${Math.round(f.size / 1024)} KB)`).join(', ');
      }
    }

    return '';
  }
}
