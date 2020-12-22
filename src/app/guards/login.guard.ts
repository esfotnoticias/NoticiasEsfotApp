import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { AuthService } from '../services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private auth:AuthService,private router:Router){

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return new Promise(resolve => {
        this.auth.afAuth.user.subscribe(user => {
          if (user && user.emailVerified) {
            resolve(true);
          } else {
            if(user){
              this.router.navigate(['/verify-email']);
              resolve(false);
            }else{
              this.router.navigate(['/login']);
              resolve(false);
            }


         /*    this.router.navigate(['/login']);
            resolve(false); */
          }
        });
      });
  }
  
}
