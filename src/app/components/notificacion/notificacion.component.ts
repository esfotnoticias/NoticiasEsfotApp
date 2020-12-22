import { Component, Input, OnInit } from '@angular/core';
import { NoticacionesService } from 'src/app/services/noticaciones.service';
import { Usuario, Notificacion } from '../../Interfaces/interfaces';
import { RouterModule, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { TodoService } from 'src/app/services/todo.service';
@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
  styleUrls: ['./notificacion.component.scss'],
})
export class NotificacionComponent implements OnInit {
  @Input()  notificacion:Notificacion;
  @Input()  user:Usuario;
  valor:boolean=false;
  constructor(private notify:NoticacionesService,private router: Router,private publicaciones:TodoService,
    public toastController: ToastController ) { }

  ngOnInit() {
    if(this.notificacion){
      this.valor=true;
     
    }
  }
  solover(){
    
    this.router.navigate(['/main/tabs/tab7', this.notificacion.idp ]);
    this.notify.actualizarEstaNoti(this.user.uid,this.notificacion.idnot);
    this.publicaciones.updateViews2(this.notificacion.idp);
  }
  grupos(){
    this.router.navigate(['/main/tabs/tab5']);
    this.notify.actualizarEstaNoti(this.user.uid,this.notificacion.idnot);
  }
  comentario(){
    
    this.router.navigate(['/main/tabs/tab7', this.notificacion.idp, this.notificacion.acceso ]);
    this.notify.actualizarEstaNoti(this.user.uid,this.notificacion.idnot);
  }
  verper(){
    this.router.navigate(['/main/tabs/tab3']);
    this.notify.actualizarEstaNoti(this.user.uid,this.notificacion.idnot);
  }
  admin(){
    this.presentToast("Esta acción solo puede realizarse en el sistema web");
  }
  async presentToast( mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

}
