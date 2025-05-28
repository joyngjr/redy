import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../environment'; // adjust path as needed

@Injectable({
  providedIn: 'root'
})
export class ConversationWebsocketService {
  private socket$?: WebSocketSubject<any>;

  connect(conversationId: string) {
    const url = `${environment.wssServerUrl}/api/conversation/webrtc/${conversationId}`;
    console.log('Connecting to WebSocket:', url);
    this.socket$ = webSocket({
      url,
      deserializer: msg => JSON.parse(msg.data),
    });
    return this.socket$;
  }

  send(data: any) {
    this.socket$?.next(data);
  }

  close() {
    this.socket$?.complete();
  }
}
