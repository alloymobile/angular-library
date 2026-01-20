import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
  AfterViewInit,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdInputModel, TdInputOption } from './td-input.model';
import { TdIcon } from '../td-icon/td-icon';
import { IdHelper } from '../../share/id-helper';
import { OutputObject } from '../../share/output-object';

/**
 * TdInput - Comprehensive form input component
 *
 * Supports: text, email, password, number, date, datetime-local, time,
 * textarea, select, multiselect, radio, checkbox, switch, file, canvas
 *
 * Usage:
 * ```html
 * <td-input [input]="inputModel" (output)="handleChange($event)"></td-input>
 * ```
 *
 * Emits OutputObject on change and blur events.
 */
@Component({
  selector: 'td-input',
  standalone: true,
  imports: [CommonModule, FormsModule, TdIcon],
  templateUrl: './td-input.html',
  styleUrl: './td-input.css',
})
export class TdInput implements OnInit, OnChanges, AfterViewInit {
  private domIdRef = new IdHelper();

  @Input({ required: true }) input!: TdInputModel;
  @Output() output = new EventEmitter<OutputObject>();

  @ViewChild('canvasEl') canvasRef!: ElementRef<HTMLCanvasElement>;

  domId = '';

  // Internal state
  val = signal<string | string[] | boolean | File | File[]>('');
  touched = signal(false);

  // Multiselect state
  msOpen = signal(false);
  msQuery = signal('');

  // Canvas state
  private drawing = false;
  private lastPoint = { x: 0, y: 0 };
  private hasDrawn = false;

  // Computed validation
  errors = computed(() => this.validate(this.val()));
  showError = computed(() => this.touched() && this.errors().length > 0);

  // Input class with validation state
  inputClass = computed(() => {
    const base = this.input?.className ?? 'form-control';
    return this.showError() ? `${base} is-invalid` : base;
  });

  // Wrapper class
  wrapClass = computed(() => {
    return this.input?.colClass ?? 'col-12 col-md-6 mx-auto';
  });

  // Multiselect computed values
  msSelected = computed(() => {
    const v = this.val();
    return Array.isArray(v) ? v.map(x => String(x)) : [];
  });

  msDisplayText = computed(() => {
    const selected = this.msSelected();
    const options = this.input?.options ?? [];
    const map = new Map<string, string>();

    options.forEach(o => {
      map.set(String(o.value), o.label);
    });

    const labels = selected
      .map(x => map.has(x) ? map.get(x) : x)
      .filter(s => typeof s === 'string' && s.trim() !== '');

    return labels.join(', ');
  });

  msFilteredOptions = computed(() => {
    const q = this.msQuery().trim().toLowerCase();
    const options = this.input?.options ?? [];

    if (!q) return options;

    return options.filter(o => {
      const label = o.label.toLowerCase();
      const value = String(o.value).toLowerCase();
      const slug = (o as { slug?: string }).slug?.toLowerCase() ?? '';
      return label.includes(q) || value.includes(q) || slug.includes(q);
    });
  });

  ngOnInit(): void {
    if (!this.input || !(this.input instanceof TdInputModel)) {
      throw new Error('TdInput requires `input` (TdInputModel instance).');
    }
    this.domId = this.domIdRef.getDomId('input', this.input.id);
    this.val.set(this.input.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['input']) {
      this.val.set(this.input?.value ?? '');
      this.touched.set(false);
      this.msOpen.set(false);
      this.msQuery.set('');
    }
  }

  ngAfterViewInit(): void {
    if (this.input?.type === 'canvas') {
      this.initCanvas();
    }
  }

  // Validation
  private validate(candidate: unknown): string[] {
    const errs: string[] = [];
    const trimmed = typeof candidate === 'string' ? candidate.trim() : candidate;

    if (this.input.required) {
      const isEmptyArray = Array.isArray(trimmed) && trimmed.length === 0;
      const isEmptyScalar = !Array.isArray(trimmed) &&
        (trimmed === '' || trimmed === false || trimmed == null);

      if (isEmptyArray || isEmptyScalar) {
        errs.push('This field is required.');
      }
    }

    if (typeof trimmed === 'string') {
      if (this.input.minLength != null && trimmed.length < this.input.minLength) {
        errs.push(`Minimum length is ${this.input.minLength}`);
      }
      if (this.input.maxLength != null && trimmed.length > this.input.maxLength) {
        errs.push(`Maximum length is ${this.input.maxLength}`);
      }
      if (this.input.pattern) {
        try {
          const re = new RegExp(this.input.pattern);
          if (!re.test(trimmed)) {
            errs.push('Invalid format.');
          }
        } catch {
          errs.push('Invalid validation pattern configuration.');
        }
      }
      if (this.input.passwordStrength) {
        const strongEnough = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(trimmed);
        if (!strongEnough) {
          errs.push('Password is too weak.');
        }
      }
    }

    // Custom validators
    for (const validator of this.input.validators) {
      const result = validator(candidate);
      if (result) errs.push(result);
    }

    return errs;
  }

  // Emit output
  private emit(nextVal: unknown, action: string): void {
    const errs = this.validate(nextVal);
    const hasError = errs.length > 0;

    const out = new OutputObject({
      id: this.domId,
      type: 'input',
      action,
      error: hasError,

      // REQUIRED by your format (always an array)
      errorMessage: errs,

      data: {
        name: this.input.name,

        // can be string | string[] | boolean | File | File[] | etc.
        value: nextVal,

        // REQUIRED by your format (always an array)
        errors: errs,
      },
    });

    this.output.emit(out);
  }

  // Event handlers
  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;

    // Handle switch type
    if (this.input.type === 'switch') {
      const checked = target.checked;
      this.val.set(checked);
      this.emit(checked, 'change');
      return;
    }

    // Handle checkbox type (multiple selection)
    if (this.input.type === 'checkbox') {
      const value = target.value;
      const currentVal = this.val();
      const prev: string[] = Array.isArray(currentVal)
        ? currentVal.filter((item): item is string => typeof item === 'string')
        : [];
      const idx = prev.indexOf(value);

      if (idx > -1) {
        prev.splice(idx, 1);
      } else {
        prev.push(value);
      }

      this.val.set([...prev]);
      this.emit([...prev], 'change');
      return;
    }

    // Handle radio type (single selection)
    if (this.input.type === 'radio') {
      const value = target.value;
      this.val.set(value);
      this.emit(value, 'change');
      return;
    }

    // Handle all other input types
    this.val.set(target.value);
    this.emit(target.value, 'change');
  }

  onSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;

    if (this.input.type === 'multiselect' && !this.input.searchable) {
      const selected = Array.from(target.selectedOptions).map(opt => opt.value);
      this.val.set(selected);
      this.emit(selected, 'change');
      return;
    }

    this.val.set(target.value);
    this.emit(target.value, 'change');
  }

  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const fileList = target.files;
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    const nextVal = this.input.multiple ? files : files[0];

    this.val.set(nextVal);
    this.emit(nextVal, 'change');

    target.value = '';
  }

  onBlur(): void {
    this.touched.set(true);
    this.emit(this.val(), 'blur');
  }

  // Multiselect handlers
  onMsInputClick(): void {
    if (!this.input.disabled) {
      this.msOpen.set(true);
    }
  }

  onMsToggle(option: TdInputOption): void {
    const id = String(option.value);
    const next = [...this.msSelected()];
    const idx = next.indexOf(id);

    if (idx > -1) {
      next.splice(idx, 1);
    } else {
      next.push(id);
    }

    this.val.set(next);
    this.emit(next, 'change');
  }

  onMsClear(): void {
    this.val.set([]);
    this.emit([], 'change');
  }

  onMsClose(): void {
    this.msOpen.set(false);
  }

  onMsSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.msQuery.set(target.value);
  }

  isOptionSelected(option: TdInputOption): boolean {
    return this.msSelected().includes(String(option.value));
  }

  // Canvas methods
  private initCanvas(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = this.input.canvasStrokeWidth;
    ctx.strokeStyle = '#000';
  }

  private clearCanvasSurface(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  private getCanvasDataUrl(): string {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return '';
    return canvas.toDataURL('image/png');
  }

  private getPoint(event: MouseEvent | TouchEvent): { x: number; y: number } {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    if ('touches' in event && event.touches[0]) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top,
      };
    }

    const mouseEvent = event as MouseEvent;
    return {
      x: mouseEvent.clientX - rect.left,
      y: mouseEvent.clientY - rect.top,
    };
  }

  private drawLine(from: { x: number; y: number }, to: { x: number; y: number }): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }

  onCanvasStart(event: MouseEvent | TouchEvent): void {
    if (this.input.disabled) return;
    event.preventDefault();

    this.drawing = true;
    const p = this.getPoint(event);
    this.lastPoint = p;
    this.hasDrawn = true;
    this.drawLine(p, p);
  }

  onCanvasMove(event: MouseEvent | TouchEvent): void {
    if (this.input.disabled || !this.drawing) return;
    event.preventDefault();

    this.hasDrawn = true;
    const p = this.getPoint(event);
    this.drawLine(this.lastPoint, p);
    this.lastPoint = p;
  }

  onCanvasEnd(): void {
    if (this.input.disabled || !this.drawing) return;
    this.drawing = false;

    const next = this.hasDrawn ? this.getCanvasDataUrl() : '';
    this.val.set(next);
    this.emit(next, 'change');
  }

  clearCanvas(): void {
    this.clearCanvasSurface();
    this.initCanvas();
    this.hasDrawn = false;
    this.val.set('');
    this.emit('', 'change');
  }

  // Helper: Check if a checkbox or radio option is selected
  isChecked(optionValue: string): boolean {
    const v = this.val();
    const optionStr = String(optionValue);

    if (this.input.type === 'radio') {
      return String(v) === optionStr;
    }

    if (this.input.type === 'checkbox' && Array.isArray(v)) {
      return v.some(item => String(item) === optionStr);
    }

    return false;
  }

  // Helper: Check if switch is checked
  isSwitchChecked(): boolean {
    const v = this.val();
    return v === true;
  }

  getFilePreview(): string {
    const v = this.val();
    if (!v) return '';

    if (typeof v === 'string') return v;

    if (v instanceof File) {
      return `${v.name} (${Math.round(v.size / 1024)} KB)`;
    }

    if (Array.isArray(v)) {
      return v
        .filter((f): f is File => f instanceof File)
        .map(f => `${f.name} (${Math.round(f.size / 1024)} KB)`)
        .join(', ');
    }

    return '';
  }

  get stringValue(): string {
    const v = this.val();
    return typeof v === 'string' ? v : '';
  }

  get arrayValue(): string[] {
    const v = this.val();
    return Array.isArray(v) ? v.map(String) : [];
  }
}
