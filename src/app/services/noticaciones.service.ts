import { Injectable } from '@angular/core';
import { AngularFirestore,AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { first, map, filter, combineAll } from 'rxjs/operators';
import { Notificacion } from 'src/app/Interfaces/interfaces';
@Injectable({
  providedIn: 'root'
})
export class NoticacionesService {

  constructor(private db:AngularFirestore) { }


  prueba(){
    console.log('funciona el service :v');
  }
  guardarNoti(uid:string, noti:Notificacion){
    noti.notFechaP=new Date();
    //console.log(noti.idg);
   // console.log(uid);
    
    return this.db.collection(`usuarios/${uid}/notificaciones`).add({
      //mensaje:'debe funcar'
      // idg:noti.idg,
      iduc:noti.iduc,
      idp:noti.idp,
      tipo:noti.tipo,
      acceso:noti.acceso,
      codigo:noti.codigo,
      mensaje:noti.mensaje,
      notFechaP:noti.notFechaP,
      autorimagenNot:noti.autorimagenNot,
      seeNot:false

    }).then(res=>{
      this.actualizarIdNoti(uid,res.id);
    })
  }
  actualizarIdNoti(uid:string,id:string){
    this.db.doc(`usuarios/${uid}/notificaciones/${id}`).update({
      idnot:id,
    });
  }
  actualizarEstaNoti(uid:string,id:string){
    this.db.doc(`usuarios/${uid}/notificaciones/${id}`).update({
      seeNot:true
    });
  }
  /*
  selectNotificaciones(id:string){
    console.log(id +'es el id');
    return this.db.collection(`usuarios/${id}/notificaciones`).snapshotChanges().pipe(map(resp=>resp.map(a=>{
      const data= a.payload.doc.data() as Notificacion;
      const  id = a.payload.doc.id;
      return { id, ...data};
    })
    ))
  }
  */
 selectNotificaciones(id:string){
  return this.db.collection(`usuarios/${id}/notificaciones/`, ref=>{
   return ref .where('seeNot','==',false)
               .orderBy('notFechaP','desc')
}).snapshotChanges().pipe(map(resp=>resp.map(a=>{
    const data= a.payload.doc.data() as Notificacion;
    const  id = a.payload.doc.id;
    return { id, ...data};
  })
  ))
}
}
