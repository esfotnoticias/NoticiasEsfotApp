import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { first, map, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Grupos } from 'src/app/Interfaces/interfaces';
import * as firebase from 'firebase';
import { TodoService } from './todo.service';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class GruposService {
  groupRef:AngularFirestoreDocument<Grupos>;
  grupos: Observable<Grupos>;
  constructor(private db:AngularFirestore,private todoservice:TodoService,private auth:AuthService ) { }
  getGroup(id:string){

    const userRef : AngularFirestoreDocument<Grupos> = this.db.doc(`grupos/${id}`);
      this.grupos=userRef.snapshotChanges().pipe(map(a=>{
      const data=a.payload.data() as Grupos;
      if(data){
        const id=a.payload.id;
        return {id, ...data};
      }else{
        return null;
      }
    }))
  return this.grupos;
  }
  getGroupsOwner(id:string){
    return this.db.collection('grupos', ref=>ref.where('idownerGroup','==',id)).snapshotChanges().pipe(map(resp=>resp.map(a=>{
      const data= a.payload.doc.data() as Grupos;
      const  id = a.payload.doc.id;
      return { id, ...data};
    })
    )
      )
  }
  getGroupsUser(id:string){
    return this.db.collection('grupos').snapshotChanges().pipe(map(resp=>resp.map(a=>{
      const data= a.payload.doc.data() as Grupos;
      const  id = a.payload.doc.id;
      return { id, ...data};
    })
    )
      )
  }
    
  guardarGrupo(grupo:Grupos){
    return this.db.collection('grupos').add({
      idGroup:grupo.idGroup,
      idownerGroup:grupo.idownerGroup,
      nameGroup:grupo.nameGroup,
      detalleGroup:grupo.detalleGroup,
      maxmienbrosGroup:grupo.maxmienbrosGroup,
      mienbros:grupo.mienbros
    })
  }
  agregarGrupo(id:string,gid:string ){
    this.db.doc(`usuarios/${id}`).update({
      grupos: firebase.firestore.FieldValue.arrayUnion(gid)
    });
   
  }
  actualizarGrupo(idg:string,grupo:Grupos){
    return this.db.doc(`grupos/${idg}`).update({
       nameGroup:grupo.nameGroup,
       detalleGroup:grupo.detalleGroup,
       maxmienbrosGroup:grupo.maxmienbrosGroup,
       idGroup:grupo.idGroup
    
     })
   }
  agregarMiembros(id:string,uid:string ){
    return this.db.doc(`grupos/${id}`).update({
       mienbros: firebase.firestore.FieldValue.arrayUnion(uid)
     });
    
   }
   actualizarIdgGrupo(idg:string,id:string){
    this.db.doc(`grupos/${idg}`).update({
      idg:id
     })
   }
   makeid() { 
    console.log('si entra');
    var text = ""; 
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; 
    for (var i = 0; i < 6; i++) {     
      text =text+ possible.charAt(Math.floor(Math.random() * possible.length)); 
    }
    return text; 
  } 
  eliminarMienbros(id:string,uid:string){
    this.db.doc(`grupos/${id}`).update({
      mienbros: firebase.firestore.FieldValue.arrayRemove(uid)
    });
  }

  eliminarGropoFinal(id:string){
    return this.db.doc(`grupos/${id}`).delete().then(()=>{
      console.log('se borro satisfactoriamente')
    }).catch(err=>{
      return err;
    });
  }

  
  eliminarGrupoDefi(miembros:string[], gid:string){
    for(let id of miembros){
        this.auth.eliminarGrupo(id, gid);
    };
    this.todoservice.getPostIdGroup(gid).subscribe(resp=>{
      resp.length
      if(resp.length!=0){
        for(let pub of resp){
          this.todoservice.eliminarPublicacin(pub.idPost);
        }
     }
    });
     this.eliminarGropoFinal(gid);
  }
  probar(codigo:string){
    return this.db.collection('grupos', ref=>{
      return ref .where('idGroup','==', codigo)
                 .limit(1)}
                 ).snapshotChanges().pipe(map(resp=>resp.map(a=>{
      const data= a.payload.doc.data() as Grupos;
      const  id = a.payload.doc.id;
      return { id, ...data};
    })
    ));
  }
  getGroups(){
    //console.log(grupos);
    
    return this.db.collection('grupos').snapshotChanges().pipe(map(resp=>resp.map(a=>{
      const data= a.payload.doc.data() as Grupos;
      const  id = a.payload.doc.id;
      return { id, ...data};
    })
    )
      )
  }
}
