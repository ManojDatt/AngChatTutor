import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js'; 
import { ResponseModel } from '../models/response.model';
import { map, catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private httpClient: HttpClient) {
    
   }
 
  plainHeaderOption = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  }

  public loggedIn = new BehaviorSubject<boolean>(false)// {1}

  public isLoggedIn(){
     if(this.getAuthToken() !== null){
      this.loggedIn.next(true)
    }
    else{
      this.loggedIn.next(false)
    }
    return this.loggedIn
  }
  setAuthToken(data: any): void{
    var authData = CryptoJS.AES.encrypt(JSON.stringify(data),"$34552Bfgdg@$@$#%@B@#$%#@%").toString()
    localStorage.setItem('_PDATA', authData)
    this.loggedIn.next(true)
  }
  
  getAuthToken(){
    var sci_data = localStorage.getItem('_PDATA')
    if(sci_data != undefined){
      var plan_data = CryptoJS.AES.decrypt(sci_data, "$34552Bfgdg@$@$#%@B@#$%#@%").toString(CryptoJS.enc.Utf8);
      var json_data=JSON.parse(plan_data)
      return json_data.token
    }else{
      return null
    }
    
  }

  getUserProfile(){
    var sci_data = localStorage.getItem('_PDATA')
    return JSON.parse(CryptoJS.AES.decrypt(sci_data, "$34552Bfgdg@$@$#%@B@#$%#@%").toString(CryptoJS.enc.Utf8))
  }

  logOut(){
    this.loggedIn.next(false)
    localStorage.removeItem('_PDATA')
    localStorage.removeItem('ACCESS_TOKEN')
    return true
  }

  public autheticatedHeader(){
    var authHeaderOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': "Token "+this.getAuthToken()
      })
    }
    return authHeaderOptions
  }
  // API Requests
  
  userLogin(data: any): Observable<ResponseModel>{
    return this.httpClient.post(environment.apiUrl+"account/login", data, this.plainHeaderOption).pipe(
        map(data => new ResponseModel().deserialize(data)),
        catchError(() => throwError('Users login failed'))
      )
  }

  getAllUsers(): Observable<ResponseModel>{
    return this.httpClient.get(environment.apiUrl+"account/all", this.autheticatedHeader()).pipe(
        map(data => new ResponseModel().deserialize(data)),
        catchError(() => throwError('Users list not found'))
      )
  }

  getRoomNumber(guest:number): Observable<ResponseModel>{
    return this.httpClient.get(environment.apiUrl+"chat/get-room/"+guest.toString(), this.autheticatedHeader()).pipe(
        map(data => new ResponseModel().deserialize(data)),
        catchError(() => throwError('Room not found'))
      )
  }

  getRoomMessages(room_number:number): Observable<ResponseModel>{
    return this.httpClient.get(environment.apiUrl+"chat/"+room_number+"/messages", this.autheticatedHeader()).pipe(
        map(data => new ResponseModel().deserialize(data)),
        catchError(() => throwError('Room messages not found'))
      )
  }
}