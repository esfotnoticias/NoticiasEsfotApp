import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Publicacion,FileItem } from '../Interfaces/interfaces';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';

import { EventEmitter } from 'events';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase';
@Injectable({
  providedIn: 'root'
})
export class TodoService {

  // nuevoPost = new EventEmitter<Publicacion>();
  public storageRef=firebase.storage().ref();
  uploadPercent: Observable<number>;
  downloadUrl: Observable<string>;
  private publicacionCollection: AngularFirestoreCollection<Publicacion>;
  private publicaciones: Observable<Publicacion[]>;

  constructor(private db: AngularFirestore, private afSG: AngularFireStorage) {

    this.publicacionCollection = db.collection<Publicacion>('publicaciones');
    this.publicaciones = this.publicacionCollection.snapshotChanges().pipe(map(
      actions => {
        return actions.map( a => {
          const data = a.payload.doc.data();
          const idPost = a.payload.doc.id;
          return {idPost, ...data};
        });
      }
    ));
   }

   getPublicaciones() {
    return this.publicaciones;
   }

   getPublicacionesSol() {
    return this.db.collection('publicaciones', ref=>{
      return ref .where('tipoPost','==','Solicitudes')
                 .orderBy('fechaPost','desc')
    }).snapshotChanges().pipe(map(resp=>resp.map(a=>{
      const data= a.payload.doc.data() as Publicacion;
      const  id = a.payload.doc.id;
      return { id, ...data};
    })
    ))
   }


   getPublicacion( idPost: string ){
    return this.publicacionCollection.doc<Publicacion>(idPost).valueChanges();
   }

   updatePublicacion( publicacion: Publicacion, idPost: string ){
     return this.publicacionCollection.doc(idPost).update(publicacion);
   }

   addPublicacion( publicacion: Publicacion ){
     return this.publicacionCollection.add( publicacion );
   }

   removePublicacion( idPost: string ){
     return this.publicacionCollection.doc( idPost ).delete();
   }


   almacenarArchivos(imagenes:FileItem[], carpeta:string):Promise<any[]>{
    console.log(imagenes.length + 'longitud imagenes');
     let images=[];
   return new Promise<any[]>( (resolve)=>{
     let i=0;
   for (const item of imagenes){
     item.uploading=true;
     if(item.progreso>=100){
       continue;
     }
     var fec= new Date().getTime()
      const uploadTask: firebase.storage.UploadTask =
                 this.storageRef.child(`${carpeta }/${fec}_${ item.name }`)
                           .put( item.archivo );
       uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
       ( snapshot: firebase.storage.UploadTaskSnapshot ) =>
                         item.progreso = ( snapshot.bytesTransferred / snapshot.totalBytes ) * 100,
                         ( error ) => console.error('Error al subir', error ),
           async() => {
             console.log('archivo subido correctamente');
             console.log('img: '+imagenes.length + "i: "+i);
             item.url = await this.storageRef.child(uploadTask.snapshot.ref.fullPath).getDownloadURL();
              images.push({url:item.url, name:fec+'_'+item.name});
             if(images.length===imagenes.length){
               item.uploading = false;
               console.log(item.uploading);
               return resolve(images);
             }
           }
     );
    }
   }
  )
}

savePublicacion(publicacion:Publicacion,imagenes:FileItem[]){
  publicacion.fechaPost=new Date();
  var retorno:boolean;
  return new Promise<any>( (resolve)=>{
    if(imagenes.length!=0 ){
      this.almacenarArchivos(imagenes, 'publicacion').then(resp=>{
        publicacion.imagenPost=resp;
          this.guardarPost(publicacion).then(res=>{
            this.updateId(res.id, res.id);
                retorno=true;
                return resolve(res);  
          });
      });
    }else if(imagenes.length==0){
          publicacion.imagenPost=[];
            this.guardarPost(publicacion).then(res=>{
              retorno=true;
              this.updateId(res.id, res.id);
              return resolve(res);
          });
      
    };
   }).catch(err=>{
     return  "error";
   })
}
guardarPost(publicacion:Publicacion){
  return this.db.collection('publicaciones').add({
    idPost: "",
    tipoPost: publicacion.tipoPost,
    categoriaPost: publicacion.categoriaPost,
    estadoPost: publicacion.estadoPost,
    tituloPost: publicacion.tituloPost,
    autorNamePost:  publicacion.autorNamePost,
    viewsPost: publicacion.viewsPost,
    fechaPost:  publicacion.fechaPost,
    fechaInicioPost: publicacion.fechaInicioPost,
    fechaFinPost:  publicacion.fechaFinPost,
    descripcionPost:  publicacion.descripcionPost,
    imagenPost:  publicacion.imagenPost,
    autorIdPost:  publicacion.autorIdPost,
    autorImagenPost:  publicacion.autorImagenPost,
    docsPost:  publicacion.docsPost,
    ytUrlPost:  publicacion.ytUrlPost,
    horainicioPost:  publicacion.horainicioPost,
    horafinPost:  publicacion.horafinPost,
    telPost:  publicacion.telPost,
    lugarPost:  publicacion.lugarPost,
    comentarioPost: publicacion.comentarioPost,
    idGrupoPost: publicacion.idGrupoPost,
    nameGroupPost: publicacion.nameGroupPost
  })
}
  updateId(id:string, idpost:string){
  
    this.db.doc(`publicaciones/${id}`).update({
      idPost:idpost,
    });

  }

  updateViews(id:string, valor:number){
      this.db.doc(`publicaciones/${id}`).update({
        viewsPost:valor+1,
      });
  
    }
    updateViews2(id:string){
      this.db.doc(`publicaciones/${id}`).update({
        viewsPost:firebase.firestore.FieldValue.increment(1)
      });
  
    }

    getPost(group:string[]){
      //console.log(group);
      return this.db.collection('publicaciones', ref=>{
        return ref .where('estadoPost','==','aprobado')
                   .orderBy('fechaPost','desc')
      }).snapshotChanges().pipe(map(resp=>resp.map(a=>{
        const data= a.payload.doc.data() as Publicacion;
        const  id = a.payload.doc.id;
        return { id, ...data};
      })
      ))
    }

    getPostBusqueda(busqueda:string, tipo:string, group:string[]){
      let resultado:Publicacion[]=[];
      let bus=busqueda.toLocaleLowerCase();
      return new Promise<Publicacion[]>((resolve)=>{
        if(tipo=='Todos'){
          this.getPost(group).subscribe(res=>{
            for(let post of res){
              let valor=post.tituloPost.toLocaleLowerCase();
              let valor1=post.nameGroupPost.toLocaleLowerCase();
              
              if(valor.indexOf(bus)>=0 ||valor1.indexOf(bus)>=0){
                resultado.push(post);
              }
            }
           
            resolve(resultado)
         }
         )
        }else if(tipo!='Todos'){
          
          this.getPostCategoria(group,tipo).subscribe(res=>{
            for(let post of res){
              let valor=post.tituloPost.toLocaleLowerCase();
              let valor1=post.nameGroupPost.toLocaleLowerCase();
              if(valor.indexOf(bus)>=0 ||valor1.indexOf(bus)>=0){
                resultado.push(post);
              }
            }
           
            resolve(resultado);
         }
         )
        }
      })
    }

    getPostCategoria(group:string[], tipo:string){
      return this.db.collection('publicaciones', ref=>{
        return ref .where('idGrupoPost','in',group)
                  .where('estadoPost','==','aprobado')
                   .where('categoriaPost','==',tipo)
                   .orderBy('fechaPost','desc')
      }).snapshotChanges().pipe(map(resp=>resp.map(a=>{
        const data= a.payload.doc.data() as Publicacion;
        const  id = a.payload.doc.id;
        return { id, ...data};
      })
      ))
    }

    getPostIdGroup(idg:string){
      return this.db.collection('publicaciones', ref=>{
        return ref .where('idGrupoPost','==',idg)
      }).snapshotChanges().pipe(map(resp=>resp.map(a=>{
        const data= a.payload.doc.data() as Publicacion;
        const  id = a.payload.doc.id;
        return { id, ...data};
      })
      ))
    }
    

    eliminarPublicacin(id:string){
      return this.db.doc(`publicaciones/${id}`).delete().then(()=>{
        console.log('se borro satisfactoriamente')
      }).catch(err=>{
        return err;
      });
    }
}
