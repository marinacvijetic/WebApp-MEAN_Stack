/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LocalstorageService } from './localstorage.service';



@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private localStorageToken: LocalstorageService
  ) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = this.localStorageToken.getToken();
    
    
    if(token)
    {
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));
      console.log(tokenDecode)
      if(tokenDecode.isAdmin && !this._tokenExpired(tokenDecode))
      return true;
    }
    this.router.navigate(['/login']);
    return false;

  }
    //if token expired
    private  _tokenExpired(expiration: any) : boolean{
      return Math.floor(new Date().getTime() / 1000) >= expiration
  }
  
}
