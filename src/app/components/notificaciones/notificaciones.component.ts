import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/services/auth.service';
import { NoticacionesService } from 'src/app/services/noticaciones.service';
import { FileItem, Publicacion, Usuario, Notificacion } from '../../Interfaces/interfaces';
@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss'],
})
export class NotificacionesComponent implements OnInit {
  public user$: Observable<any> = this.auth.afAuth.user;
  notis:Notificacion[]=[];
  id:string;
  valor=true;
  tamanio=false;
  public user = new Usuario();
  constructor(private notificaciones:NoticacionesService,private auth: AuthService,) {
    this.user$.subscribe(resp => {
      if (resp != null) {
        this.notificaciones.selectNotificaciones(resp.uid).subscribe(resp=>{
          this.notis=resp;
          if(resp){

            if(resp.length!=0){
              this.tamanio=false;
            }else{
              this.tamanio=true    
            }
            
            
          }
        })
        this.id=resp.id;
        this.auth.getUser(resp.uid).subscribe(rep => { 
            
            if(rep!=undefined){
              this.valor=true;
              this.user=rep;
            }
        });
  }
  })

  }

  ngOnInit() {
    if(this.id){
      this.notificaciones.selectNotificaciones(this.id).subscribe(resp=>{
        this.notis=resp;
      })
    }

  }

}
