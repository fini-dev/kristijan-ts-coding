import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'http://localhost:3000/api'; // Your backend API URL

  constructor(private http: HttpClient) {}

  createMessage(message: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/message`, message);
  }

  getMessages(): Observable<any> {
    return this.http.get(`${this.apiUrl}/messages`);
  }
}
