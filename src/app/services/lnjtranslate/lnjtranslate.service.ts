import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LnjtranslateService {

  constructor(private http: HttpClient) {}


  translate(request: string[], target = 'fr') {
    return this.http.post<any[]>('https://flowery-admitted-bike.glitch.me/'+target, request)
  }
}
