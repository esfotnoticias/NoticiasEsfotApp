import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { AuthService } from '../services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class EmailGuard implements CanActivate {
  constructor(private auth:AuthService,private router:Router){

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return new Promise(resolve => {
        this.auth.afAuth.user.subscribe(user => {        
          if (isNullOrUndefined(user)) {
            this.router.navigate(['/login']);
            return false;
          } else {
            if(!user.emailVerified){
              resolve(true);
            }else{
              this.router.navigate(['/main/tabs/tab1']);
              resolve(false);
            /*   this.auth.$user.subscribe(res=>{
                if(res){
                    this.tipodeUsuario(res);
                    resolve(false);
                }
                
              }) */
            }
       /*      this.auth.$user.subscribe(res=>{
              if(res){
                if(res.estado=='nuevo'){
                  //console.log('al guard del frist 1');
                   resolve(true);
                }else{
                  //console.log('al guard del frist 2');
                  this.tipodeUsuario(res);
                  resolve(false);
                }   
              }
              
            }) */
          }
        });
      });
  }
  
}
