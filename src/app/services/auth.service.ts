import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public helper: JwtHelperService) { }

  public isAuthenticated(): boolean {
    let token = localStorage.getItem('token');
    //console.log(token);
    if (token == null) {
      return false;
    } else {
      const isExpired = !this.helper.isTokenExpired(token);
      console.log('expired: '+ !isExpired);
      return isExpired;
    }
  }
}
