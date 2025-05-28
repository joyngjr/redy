import { Component, Input, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConversationWebsocketService } from '../../services/conversation-websocket.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../environment';
import { PixelStreamingVideoComponent } from '../video-call/pixel-video-streaming/pixel-video-streaming.component';
import { ConversationSetup } from '../../models/conversation-setup.model';

@Component({
  standalone: true,
  selector: 'app-reusable-conversation',
  imports: [PixelStreamingVideoComponent],
  template: `
    <div>
      <app-pixel-streaming-video [avatarId]="avatarUuid"></app-pixel-streaming-video>
      <audio #remoteAudio autoplay></audio>
    </div>
  `
})
export class ReusableConversationComponent implements OnInit, OnDestroy {
  @Input() config!: ConversationSetup;
  @ViewChild('remoteAudio', { static: true }) remoteAudioRef!: ElementRef<HTMLAudioElement>;

  private peerConnection: RTCPeerConnection | null = null;
  private localMediaStream: MediaStream | null = null;
  conversationId = '';
  avatarUuid = '';
  private sub?: Subscription;

  constructor(
    private websocketService: ConversationWebsocketService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.conversationId = this.route.snapshot.paramMap.get('conversationId')!;
    const socket$ = this.websocketService.connect(this.conversationId);

    this.sub = socket$.subscribe(msg => {
      if (msg.type === 'status' && msg.avatar_uuid) {
        this.avatarUuid = msg.avatar_uuid;
        this.setupPeerConnection();
      }
      if (msg.type === 'answer' && this.peerConnection) {
        this.peerConnection.setRemoteDescription(
          new RTCSessionDescription(msg.answer)
        );
      }
    });

    // send “setup” using whatever this.config is:
    setTimeout(() => {
      this.websocketService.send({
        type: 'setup',
        param: {
          apiKey: environment.apiKey || '',
          startMessage: this.config.startMessage,
          prompt:       this.config.prompt,
          avatar:       this.config.avatar,
          backgroundImageUrl: this.config.backgroundImageUrl,
          voice:        this.config.voice,
          temperature:  this.config.temperature,
          topP:         this.config.topP,
        }
      });
    }, 1000);
  }

   async setupPeerConnection() {
    if (this.peerConnection) {
      this.peerConnection.close();
    }

    const config: RTCConfiguration = environment.useTurnServer ? {
      iceServers: [
        { urls: `stun:${environment.stunServer}` },
        {
          urls: `turn:${environment.turnServer}`,
          username: environment.turnUsername,
          credential: environment.turnCredential,
        },
      ]
    } : {};

    this.peerConnection = new RTCPeerConnection(config);

    // Play incoming audio
    this.peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      if (this.remoteAudioRef?.nativeElement && remoteStream.getAudioTracks().length) {
        this.remoteAudioRef.nativeElement.srcObject = remoteStream;
      }
    };

    try {
      this.localMediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
        video: false,
      });

      for (const track of this.localMediaStream.getTracks()) {
        this.peerConnection.addTrack(track, this.localMediaStream);
      }

      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      // Send offer through WebSocket
      this.websocketService.send({
        type: 'offer',
        offer: this.peerConnection.localDescription
      });

    } catch (err) {
      console.error('Error setting up WebRTC audio:', err);
    }
  }

  ngOnDestroy(): void {
    this.websocketService.close();
    this.sub?.unsubscribe();
  }
}
