import {
  Component,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Config, PixelStreaming } from '@epicgames-ps/lib-pixelstreamingfrontend-ue5.3';
import { environment } from '../../../../environment';          // ← adjust path

@Component({
  standalone: true,
  selector: 'app-pixel-streaming-video',
  imports: [CommonModule],
  template: `
    <div class="w-full h-full relative overflow-hidden">
    <div
      #videoContainer
      class="w-full h-full"
      [ngStyle]="{
        transform: 'scale(' + scale + ')',
        transformOrigin: 'center center'
      }"
    ></div>
  </div>
  `,
  styleUrls: ['./pixel-video-streaming.component.scss'],
})
export class PixelStreamingVideoComponent
  implements OnInit, OnChanges, OnDestroy
{
  /** Avatar UUID that arrives from the WebSocket “status” message */
  @Input() avatarId!: string;

  @ViewChild('videoContainer', { static: true })
  videoContainer!: ElementRef<HTMLDivElement>;

  private pixelStreaming?: PixelStreaming;
  scale = 1;

  ngOnInit(): void {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();                   // initial scale
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(
    'PixelStreaming ngOnChanges:',
    'avatarId=', this.avatarId,
    'changes=', Object.keys(changes)
  );
    if (changes['avatarId'] && this.avatarId) {
      this.connectToPixelStreaming();
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize);
    try {
      this.pixelStreaming?.disconnect();
    } catch (e) {
      console.error('[PixelStreaming] disconnect error:', e);
    }
  }


  private connectToPixelStreaming(): void {
  if (!this.avatarId) { return; }

  // Close any existing session first
  this.pixelStreaming?.disconnect();

  const signallingUrl = `${environment.wssServerUrl}/avatar/${this.avatarId}`;

  const config = new Config({
    initialSettings: {
      ss:                signallingUrl,
      AutoConnect:       true,
      AutoPlayVideo:     true,
      StartVideoMuted: false,
      WebRTCFPS: 24,
      KeyboardInput: false,
      TouchInput: false,
      GamepadInput: false,
      SuppressBrowserKeys:true,
    },
  });

  this.pixelStreaming = new PixelStreaming(
    config,
    { videoElementParent: this.videoContainer.nativeElement }
  );

  // Helpful logs
  this.pixelStreaming.addEventListener('webRtcConnected', () =>
    console.log('[PixelStreaming] connected'));
  this.pixelStreaming.addEventListener('videoInitialized', () => {
    console.log('[PixelStreaming] first frame');
    // now that the library has injected the <video>...
    const vid = this.videoContainer.nativeElement.querySelector('video');
    console.log('→ video element?', vid);
    if (vid) {
      console.log('Video size:', vid.videoWidth, '×', vid.videoHeight);
    }
  });

  this.pixelStreaming.addEventListener('playStreamRejected', () =>
    this.pixelStreaming?.play());
}

  /* ------------------------------------------------------------------ */
  /*  🔍  Maintain aspect-ratio scaling                                 */
  /* ------------------------------------------------------------------ */
  handleResize = (): void => {
    const width  = window.innerWidth;
    const height = window.innerHeight;
    const currentAspect = width / height;
    const videoAspect   = 1920 / 1080;

    // replicate the React logic for best-fit scaling
    const lowScale  = videoAspect / currentAspect;
    const highScale = currentAspect / videoAspect;
    this.scale = Math.max(lowScale, highScale);
  };
}
