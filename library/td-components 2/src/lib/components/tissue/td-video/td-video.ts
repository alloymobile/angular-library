// src/lib/components/tissue/td-video/td-video.ts

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoObject } from './td-video.model';

@Component({
  selector: 'td-video',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './td-video.html',
  styleUrls: ['./td-video.css']
})
export class TdVideoComponent implements OnInit, OnChanges {
  @Input() video!: VideoObject;
  @Output() output = new EventEmitter<any>();
  @ViewChild('videoEl') videoEl!: ElementRef<HTMLVideoElement>;

  ngOnInit(): void { this.validateInput(); }
  ngOnChanges(changes: SimpleChanges): void { if (changes['video']) this.validateInput(); }

  private validateInput(): void {
    if (!this.video || !(this.video instanceof VideoObject)) {
      throw new Error('TdVideoComponent requires `video` prop (VideoObject instance).');
    }
  }

  play(): void { this.videoEl?.nativeElement?.play(); }
  pause(): void { this.videoEl?.nativeElement?.pause(); }

  onPlay(): void { this.output.emit({ id: this.video.id, type: 'video', action: 'play' }); }
  onPause(): void { this.output.emit({ id: this.video.id, type: 'video', action: 'pause' }); }
  onEnded(): void { this.output.emit({ id: this.video.id, type: 'video', action: 'ended' }); }
}
