import { Component, OnInit } from '@angular/core';
import { ChatService, Message } from '../services/chat.service';
import { WebsocketService } from '../services/websocket.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-user-window',
  templateUrl: './user-window.component.html',
  styleUrls: ['./user-window.component.css'],
  providers: [WebsocketService, ChatService]
})
export class UserWindowComponent implements OnInit {
  public users:any
  public userProfile = this.authService.getUserProfile()
  public guest_user:any
  public current_room:any
  public message:any
  public notify_message:any
  public message_side:string='right'
  public sendeBtnEnabled: boolean=false
  public room_message_list:any=new Array([])
  public chat_message:Message={
    command: "",
    room: "",
    message: "",
    receiver: "",
    sender: ""
  }

  constructor(public router: Router, private chatService: ChatService, public authService: AuthService) {  }
  ngOnInit() {
    this.authService.getAllUsers().subscribe((res)=>{
      if(res.code==200){
        this.users=res.data
      }else{
        alert(res.message)
      }
    })

    this.message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };
    this.notify_message = function (arg) {
      this.text = arg.text
      this.draw = function (_this) {
          return function () {
              var $message;
              $message = $($('.notification_template').clone().html());
              $message.addClass('').find('.text').html(_this.text);
              $('.messages').append($message);
              return setTimeout(function () {
                  return $message.addClass('appeared');
              }, 0);
          };
      }(this);
      return this;
  };

    $(document).on('keyup', '.message_input',(e)=> {
        if (e.which === 13) {
            return this.sendMessage(this.getMessageText());
        }
    });
    
  }

  submitMessage(){
    return this.sendMessage(this.getMessageText());
  };

  getMessageText() {
    var $message_input;
    $message_input = $('.message_input');
    return $message_input.val();
  };

  sendMessage(text) {
      if (text.trim() === '') {
          return;
      }
      $('.message_input').val('');
      this.chat_message.command="send"
      this.chat_message.room = this.current_room.room_number
      this.chat_message.message = text

      this.chatService.messages.next(this.chat_message)
      return true
  };

  receivedMessage(msg) {
    var $messages, message, text_message;
    $messages = $('.messages');
    if(msg.command != "join"){
      this.message_side = this.authService.getUserProfile().id == msg.sender_detail.id ? 'right': 'left';
      text_message = msg.message
      message = new this.message({
        text: text_message,
        message_side: this.message_side
      });
      message.draw();

    }else{
      this.message_side = 'left'
      if(msg.sender_id == this.userProfile.id){
        text_message = "You have joined "+msg.receiver
      }else{
        text_message = msg.sender+" has joined room "+msg.receiver
      }

      message = new this.notify_message({
          text: text_message
      });
      message.draw();
    }
    
    
    return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
};
  

  getRoom(event, guest){
    this.guest_user = guest
    if(!event.currentTarget.parentElement.classList.value.endsWith('active')){
      $(".list-group-item").removeClass('active')
      $(".messages").empty()
      event.currentTarget.parentElement.classList.add("active");
      this.authService.getRoomNumber(guest.id).subscribe((response)=>{
        this.current_room = response.data
        var socketUrl = "ws://localhost:8000/ws/stream/"+this.current_room.room_number.toString()
        this.chatService.initSocket(socketUrl)

        this.authService.getRoomMessages(this.current_room.room_number).subscribe((response)=>{
          if(response.code == 200){
            var $messages = $('.messages');
            response.data.forEach((msg)=>{
              var message, message_side;
              message_side = msg.sender_detail.id == this.userProfile.id ? "right": "left";
              message = new this.message({
                text: msg.message,
                message_side: message_side
              });
              message.draw();
            })
          }
          $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        })
        this.sendeBtnEnabled = true
        this.capureMessage()
        setTimeout(()=>{
          this.chat_message.command="join"
          this.chat_message.room = this.current_room.room_number
          this.chat_message.receiver = this.guest_user.username
          this.chatService.messages.next(this.chat_message)
          
        }, 100)
      })
    }
    
  }

  capureMessage(){
    this.chatService.messages.subscribe(msg => {
      this.receivedMessage(msg)
    });
  }

  logout(){
    this.authService.logOut()
    this.router.navigateByUrl('/login')
  }
}
