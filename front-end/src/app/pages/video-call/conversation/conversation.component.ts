import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConversationWebsocketService } from '../../../services/conversation-websocket.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environment';
import { PixelStreamingVideoComponent } from '../pixel-video-streaming/pixel-video-streaming.component'; // adjust path

@Component({
  standalone: true,
  selector: 'app-conversation',
  imports: [PixelStreamingVideoComponent],
  template: `
  <div>
    <app-pixel-streaming-video
      [avatarId]="avatarUuid">
      </app-pixel-streaming-video>
    <audio #remoteAudio autoplay></audio>
  </div>
`
})


export class ConversationComponent implements OnInit, OnDestroy {
  @ViewChild('remoteAudio', { static: true }) remoteAudioRef!: ElementRef<HTMLAudioElement>;

  private peerConnection: RTCPeerConnection | null = null;
  private localMediaStream: MediaStream | null = null;

  conversationId = '';
  avatarUuid = '';
  token = '';
  private sub?: Subscription;

  constructor(
    private websocketService: ConversationWebsocketService,
    private route: ActivatedRoute
  ) {}

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


  ngOnInit(): void {
    this.conversationId = this.route.snapshot.paramMap.get('conversationId') || '';
    const socket$ = this.websocketService.connect(this.conversationId);

    this.sub = socket$.subscribe({
      next: (msg) => {
        console.log('WebSocket message:', msg);

        if (msg.type === 'status' && msg.avatar_uuid) {
          this.avatarUuid = msg.avatar_uuid;
          this.token = msg.token ?? '';
          this.setupPeerConnection();
        }

        if (msg.type === 'answer' && this.peerConnection) {
          const remoteDesc = new RTCSessionDescription(msg.answer);
          this.peerConnection.setRemoteDescription(remoteDesc);
        }
      },
      error: (err) => console.error('WebSocket error:', err),
      complete: () => console.log('WebSocket closed')
    });

    setTimeout(() => {
      this.websocketService.send({
        type: 'setup',
        param: {
          apiKey: environment.apiKey || '',
          startMessage: 'Hello, I\'m Henry, your interviewer for today. Before we begin, can you tell me more about youself?',
          prompt: 'You are an interviewer for a job interview. You will ask the user questions and evaluate their responses.',
          avatar: 'henry',
          backgroundImageUrl: 'https://images.pexels.com/photos/683039/pexels-photo-683039.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          voice: 'henry',
          temperature: 0.7,
          topP: 0.9,
        }
      });
    }, 1000);
  }

  ngOnDestroy(): void {
    this.websocketService.close();
    this.sub?.unsubscribe();
  }
}
