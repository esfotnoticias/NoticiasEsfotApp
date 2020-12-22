import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/services/auth.service';
import { FileItem, Publicacion, Usuario, Notificacion } from '../../Interfaces/interfaces';
@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  public user$:Observable<any>= this.auth.afAuth.user;
  usuario:Usuario=new Usuario();
  valor=false;
  perfil=false;
  constructor(private auth:AuthService,) { 

    this.user$.subscribe(resp=>{
      this.auth.getUser(resp.uid).subscribe(resp=>{
        //console.log(resp);
        if(resp!=undefined){
          
          this.usuario=resp;
          this.valor=true;
          if(this.usuario.photoURL.length!=0){
            this.perfil=true;
          }else{
            this.perfil=false;
          }
        }
      })
    })
  }

  ngOnInit() {
  }

}
