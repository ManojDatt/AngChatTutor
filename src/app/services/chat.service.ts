import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { WebsocketService } from "./websocket.service";
import { map } from "rxjs/operators";

export interface Message {
  command: string,
  room: string,
  message: string,
  sender: any,
  receiver:any
};

@Injectable()
export class ChatService {
  public messages: Subject<Message>;
  constructor(private wsService: WebsocketService) {}
  initSocket(socketUrl){
    if(socketUrl != ""){
      this.messages = <Subject<Message>>this.wsService.connect(socketUrl).pipe(map(
        (response: MessageEvent): Message => {
          let data = JSON.parse(response.data);
          return data
        }
      ));
    }
  }
}