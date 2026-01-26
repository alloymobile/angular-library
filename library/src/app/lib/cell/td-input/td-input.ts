// src/app/lib/cell/td-input/td-input.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { OutputObject } from '../../share/output-object';
import { TdInputModel, TdInputOption } from './td-input.model';

import { TdIcon } from '../td-icon/td-icon';
import { TdIconModel } from '../td-icon/td-icon.model';

type FileUploaderFn = (fieldName: string, file: File, context?: any) => Promise<string>;

@Component({
  selector: 'td-input',
  standalone: true,
  imports: [CommonModule, FormsModule, TdIcon],
  templateUrl: './td-input.html',
  styleUrls: ['./td-input.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TdInput implements OnChanges {
  @Input({ required: true }) input!: TdInputModel | string | any;
  @Output() output = new EventEmitter<OutputObject>();
  @Input() fileUploader?: FileUploaderFn;

  model!: TdInputModel;

  val: any = '';
  touched = false;

  uploading = false;
  uploadError = '';

  @ViewChild('canvasRef') canvasRef?: ElementRef<HTMLCanvasElement>;
  private drawing = false;
  private lastPoint = { x: 0, y: 0 };

  get disabled(): boolean {
    return !!this.model?.disabled;
  }

  get canvasWidth(): number {
    return this.model?.width ?? 420;
  }

  get canvasHeight(): number {
    return this.model?.height ?? 180;
  }

  get strokeWidth(): number {
    return this.model?.canvasStrokeWidth ?? 2;
  }

  get baseErrors(): string[] {
    return this.validate(this.val);
  }

  get combinedErrors(): string[] {
    return this.uploadError ? [...this.baseErrors, this.uploadError] : this.baseErrors;
  }

  get showError(): boolean {
    return this.touched && this.combinedErrors.length > 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('input' in changes) {
      this.model = this.normalizeInput(this.input);

      this.val = this.model.value;
      this.touched = false;
      this.uploading = false;
      this.uploadError = '';

      if (this.model.type === 'canvas') {
        queueMicrotask(() => {
          this.initCanvas();
          this.hydrateCanvasFromValueIfNeeded();
        });
      }
    }
  }

  private normalizeInput(raw: any): TdInputModel {
    if (raw instanceof TdInputModel) return raw;

    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        return new TdInputModel(parsed);
      } catch {
        return new TdInputModel({ name: 'input', type: 'text', value: raw });
      }
    }

    return new TdInputModel(raw);
  }

  private validate(candidate: any): string[] {
    const errs: string[] = [];
    const trimmed = typeof candidate === 'string' ? candidate.trim() : candidate;

    if (this.model.required) {
      const isEmptyArray = Array.isArray(trimmed) && trimmed.length === 0;
      const isEmptyScalar =
        !Array.isArray(trimmed) && (trimmed === '' || trimmed === false || trimmed == null);

      if (isEmptyArray || isEmptyScalar) errs.push('This field is required.');
    }

    if (typeof trimmed === 'string' && this.model.minLength != null && trimmed.length < this.model.minLength) {
      errs.push(`Minimum length is ${this.model.minLength}`);
    }

    if (typeof trimmed === 'string' && this.model.maxLength != null && trimmed.length > this.model.maxLength) {
      errs.push(`Maximum length is ${this.model.maxLength}`);
    }

    if (typeof trimmed === 'string' && this.model.pattern && this.model.pattern !== '') {
      try {
        const re = new RegExp(this.model.pattern);
        if (!re.test(trimmed)) errs.push('Invalid format.');
      } catch {
        errs.push('Invalid validation pattern configuration.');
      }
    }

    if (this.model.passwordStrength && typeof trimmed === 'string') {
      const strongEnough = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(trimmed);
      if (!strongEnough) errs.push('Password is too weak.');
    }

    return errs;
  }

  private emit(nextVal: any, action: 'change' | 'blur' = 'change'): void {
    const errs = this.validate(nextVal);
    if (this.uploadError) errs.push(this.uploadError);

    const out = new OutputObject({
      id: this.model.id,
      type: 'input',
      action,
      error: errs.length > 0,
      errorMessage: errs,
      data: {
        name: this.model.name,
        value: nextVal,
        errors: errs,
      },
    });

    this.output.emit(out);
  }

  onBlur(): void {
    this.touched = true;

    if (this.model.type === 'canvas') {
      const next = this.getCanvasDataUrl();
      this.val = next;
      this.emit(next, 'blur');
      return;
    }

    this.emit(this.val, 'blur');
  }

  onTextLikeChange(v: any): void {
    this.val = v;
    this.emit(this.val, 'change');
  }

  onSelectChange(v: string): void {
    this.val = v;
    this.emit(this.val, 'change');
  }

  onMultiSelectChange(e: Event): void {
    const select = e.target as HTMLSelectElement;
    const selected: string[] = [];
    for (const opt of Array.from(select.selectedOptions)) selected.push(opt.value);
    this.val = selected;
    this.emit(this.val, 'change');
  }

  onRadioChange(v: string): void {
    this.val = v;
    this.emit(this.val, 'change');
  }

  onCheckboxToggle(value: string): void {
    const prev = Array.isArray(this.val) ? [...this.val] : [];
    const idx = prev.indexOf(value);
    if (idx > -1) prev.splice(idx, 1);
    else prev.push(value);

    this.val = prev;
    this.emit(this.val, 'change');
  }

  onSwitchToggle(e: Event): void {
    const el = e.target as HTMLInputElement;
    this.val = !!el.checked;
    this.emit(this.val, 'change');
  }

  async onFileChange(e: Event): Promise<void> {
    const inputEl = e.target as HTMLInputElement;
    const files = inputEl?.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!this.fileUploader) {
      this.val = file;
      this.uploadError = '';
      this.emit(file, 'change');
      return;
    }

    try {
      this.uploading = true;
      this.uploadError = '';
      const url = await this.fileUploader(this.model.name, file, { input: this.model });
      this.val = url;
      this.emit(url, 'change');
    } catch (err: any) {
      const msg = (err && err.message) || 'File upload failed. Please try again.';
      this.uploadError = msg;
      this.emit(this.val, 'change');
    } finally {
      this.uploading = false;
      if (inputEl) inputEl.value = '';
    }
  }

  private initCanvas(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = this.strokeWidth;
    ctx.strokeStyle = '#000';
  }

  private hydrateCanvasFromValueIfNeeded(): void {
    const v = this.val;
    if (typeof v !== 'string') return;
    if (!v.startsWith('data:image')) return;

    const canvas = this.canvasRef?.nativeElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const img = new Image();
    img.onload = () => {
      this.initCanvas();
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = v;
  }

  private getCanvasDataUrl(): string {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return '';
    return canvas.toDataURL('image/png');
  }

  private getPointFromPointerEvent(e: PointerEvent): { x: number; y: number } {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
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

  onCanvasPointerDown(e: PointerEvent): void {
    if (this.disabled) return;
    e.preventDefault();
    this.drawing = true;
    this.lastPoint = this.getPointFromPointerEvent(e);
  }

  onCanvasPointerMove(e: PointerEvent): void {
    if (this.disabled) return;
    if (!this.drawing) return;
    e.preventDefault();
    const p = this.getPointFromPointerEvent(e);
    this.drawLine(this.lastPoint, p);
    this.lastPoint = p;
  }

  onCanvasPointerUp(e?: PointerEvent): void {
    if (this.disabled) return;
    if (!this.drawing) return;
    if (e) e.preventDefault();

    this.drawing = false;
    const dataUrl = this.getCanvasDataUrl();
    this.val = dataUrl;
    this.emit(dataUrl, 'change');
  }

  clearCanvas(): void {
    this.initCanvas();
    this.val = '';
    this.emit('', 'change');
  }

  trackByOptionValue(_: number, o: TdInputOption): string {
    return o.value;
  }

  get iconForLabel(): TdIconModel | undefined {
    return this.model?.icon;
  }

  withInvalid(cls: string): string {
    return cls + (this.showError ? ' is-invalid' : '');
  }

  isArray(v: any): boolean {
    return Array.isArray(v);
  }
}
