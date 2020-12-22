import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { User } from '../../Interfaces/interfaces';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage {

  user$: Observable<User> = this.authSvc.afAuth.user;
  suscription:Subscription;
  id:string;
  constructor( private authSvc: AuthService,private router:Router ) {
    this.suscription=this.user$.subscribe(res=>{
      this.id=res.uid
    })
   }

  async onSendEmail(): Promise<void> {
    try {
      await this.authSvc.sendVerifcationEmail();
      
    } catch (error) {
      console.log('Error->', error);
    }
  }

  
  ngOnDestroy(): void {
    this.authSvc.logout();
  }
  regresar(){
    this.authSvc.actualizarTokenUser(this.id, "").then(res=>{});
    this.suscription.unsubscribe();
    this.authSvc.logout1();
    this.router.navigate(['/login']);
  }
}
