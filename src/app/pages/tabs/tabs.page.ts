import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Usuario } from 'src/app/Interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { NoticacionesService } from 'src/app/services/noticaciones.service';
import { FCM } from '@ionic-native/fcm/ngx';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnDestroy {
  public user$:Observable<any>= this.auth.afAuth.user;
  valor=false;
  numero:string;
  usuario:Usuario;
  cantidad:number;
  usuar$:Subscription;
  usu$:Subscription;
  constructor(private auth:AuthService,private notificaciones:NoticacionesService, private fcm: FCM) {
  
    this.usuar$=this.user$.subscribe(resp=>{
      this.notificaciones.selectNotificaciones(resp.uid).subscribe(resp=>{
        this.cantidad=resp.length

      })
      this.usu$= this.auth.getUser(resp.uid).subscribe(resp=>{
       
     
        if(resp!=undefined){
         
          this.fcm.getToken().then(token => {
            this.auth.actualizarTokenUser(resp.uid,token);
            console.log(token);
          });
          this.valor=true;
          this.usuario=resp;
          
        }
      })
    })
  }
  ngOnDestroy(): void {
    
    this.auth.actualizarTokenUser(this.usuario.uid, "").then(res=>{});
    this.usuar$.unsubscribe();
    this.usu$.unsubscribe();
  }
}


