import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  constructor(private http: HttpClient) { }


  sendPostRequest(msg: string, token: string) {
    console.log('va enviar un push:'+token +'token')
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization:
          'key=AAAATDSK6YE:APA91bHx1xG8OpJQlpRom9qz-ZIx3ZchyZGdvb1V1_OzhkqcM9ukzDoAjKXkJHY-qMiF9g_5RDJJUYrKHIXeWpWNkeA_WzpJT2fotxgiXyUqhkF-WQIqwV1IMfps2ekziID8DUkPfCI8'
      })
    };
    const postData = {
      notification: {
        title: 'Noticias Esfot',
        body: msg
      },
      to: token
    };


    return this.http.post('https://fcm.googleapis.com/fcm/send', postData, httpOptions);
  }
}
