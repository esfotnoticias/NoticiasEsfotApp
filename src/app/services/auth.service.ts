import { Injectable } from '@angular/core';
import { User, Usuario,FileItem } from '../Interfaces/interfaces';
import { AngularFireAuth } from '@angular/fire/auth';

import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';
import { TodoService } from './todo.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import {auth} from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user$: Observable<User>;
  public usu: Observable<Usuario>;
  public usuario = new Usuario();
  public storageRef=firebase.storage().ref();
  constructor(  public afAuth: AngularFireAuth,
                private afs: AngularFirestore,
                private google:GooglePlus,
                private todoservice:TodoService ){

    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`usuarios/${user.uid}`).valueChanges();
        }
        return of(null);
      })
    );
  }

  async resetPassword(email: string): Promise<void> {
    try {
      return this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      
    }
  }

  async loginGoogle(): Promise<User> {
    try {
      const { user } = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      return user;
    } catch (error) {
      console.log('Error->', error);
    }
  }
  
 loginwithGoogle(){
  return new Promise<any>( (resolve)=>{
    this.google.login({}).then(res=>{
      
      const user_data_google=res;
      var $crea=this.getUsuariosCorreo(user_data_google.email).subscribe(res=>{
        if(res){
          if(res.length!=0){
           
            if(res[0].creado=='firebase'){
              this.google.disconnect();
              resolve('existe');
            }else if(res[0].creado=='google'){
              this.afAuth.signInWithCredential(auth.GoogleAuthProvider.credential(null, user_data_google.accessToken)).then(resp=>{
               
                this.afs.doc(`usuarios/${resp.user.uid}`).update({
                  email : user_data_google.email,
                  nombre:user_data_google.displayName,
                  emailVerified: resp.user.emailVerified,
                });               
                resolve('redirecionar');
                $crea.unsubscribe();
              });             
            }
          }else{
            
            this.afAuth.signInWithCredential(auth.GoogleAuthProvider.credential(null, user_data_google.accessToken)).then(resp=>{
              this.afs.doc(`usuarios/${resp.user.uid}`).set({
                uid: resp.user.uid,
                carrera: "",
                rol: "invitado",
                email: user_data_google.email,
                nombre: user_data_google.displayName,
                apellido: "",
                estado: 'activo',
                genero:"",
                fechanacimiento:null,
                usuarioVerificado: true,
                emailVerified: resp.user.emailVerified,
                creado: 'google',
                photoURL: [],
                credencial: [],
                grupos: ['Global'],
                token:""
              }); 
              resolve('redirecionar');
              $crea.unsubscribe();
            });
            
          }            
        }
      })
    })
  })
}
  getUsuariosCorreo(email:string){
    return this.afs.collection('usuarios', ref=>ref.where('email','==', email)).snapshotChanges().pipe(map(resp=>resp.map(a=>{
      const data= a.payload.doc.data() as Usuario;
      const  id = a.payload.doc.id;
      return { id, ...data};
    })
    ),take(1))
  }
  actualizarTokenUser(uid:string, token:string){
    
    return  this.afs.doc(`usuarios/${uid}`).update({
        token:token,
      });
    }
  async register(email: string, password: string): Promise<User> {
    console.log( email );
    console.log( password );
    try {
      const  { user }  = await this.afAuth.createUserWithEmailAndPassword(email, password);
      await this.sendVerifcationEmail();
      return user;
    } catch (error) {
      console.log('Error->', error);
      return error;
    }
  }

  async registro(usuario:Usuario){
    const authData = {
      ...usuario,
    }
    const result= await this.afAuth.createUserWithEmailAndPassword(authData.email, authData.password).then(
      resp=>{
        console.log(resp.user.uid);
        console.log(authData);
         this.afs.doc(`usuarios/${resp.user.uid}`).set({
          uid:resp.user.uid,
          email : authData.email,
          nombre: authData.nombre,
          apellido: authData.apellido,
          fechanacimiento: authData.fechanacimiento,
          rol:authData.rol,
          usuarioVerificado:true,
          creado:'firebase',
          estado:"activo",
          genero:authData.genero,
          grupos:['Global'],
          photoURL:[],
          credencial:[],
          carrera:authData.carrera,
          token:""
      }

    );
   
    resp.user.updateProfile({
        displayName: authData.apellido,
    })
    return resp;
  });


    await this.sendVerifcationEmail();
    return result;

}

  async login(email: string, password: string): Promise<User> {

    try {
      const { user } = await this.afAuth.signInWithEmailAndPassword(email, password);
     
      return user;
    } catch (error) {
      return error;
    }
  }

  async sendVerifcationEmail(): Promise<void> {
    try {
      return (await this.afAuth.currentUser).sendEmailVerification();
    } catch (error) {
      
    }
  }

  isEmailVerified(user: User): boolean {
    return user.emailVerified === true ? true : false;
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      
    }
  }
  async logout1(){
    await this.afAuth.signOut();
   }
  


  getUser(uid: string ){

    const userRef: AngularFirestoreDocument<Usuario> = this.afs.doc(`usuarios/${uid}`);
    this.usu = userRef.snapshotChanges().pipe(map(a => {
      const data = a.payload.data() as Usuario;
      if ( data ){
        this.usuario = data;
      
        const id = a.payload.id;
        return {id, ...data};
      }else{
        return null;
      }

    }));

    return this.usu ;

  }

  getUsuariosNotificarAdmins(){
     var roles:string[]=['administrador','secretaria','docente', 'aeesfot'];
    return this.afs.collection('usuarios', ref=>ref.where('usuarioVerificado','==', true).where('rol','in',roles)).snapshotChanges().pipe(map(resp=>resp.map(a=>{
      const data= a.payload.doc.data() as Usuario;
      const  id = a.payload.doc.id;
      return { id, ...data};
    })
    ))
  }
  getUsuariosNotificarAll(){
   
    return this.afs.collection('usuarios', ref=>ref.where('estado','==', 'activo')).snapshotChanges().pipe(map(resp=>resp.map(a=>{
      
      const data= a.payload.doc.data() as Usuario;
      const  id = a.payload.doc.id;
      return { id, ...data};
    })
    ))
  }
  getUsuariosNotificarGroup( group:string[]){
    return this.afs.collection('usuarios', ref=>ref.where('estado','==', 'activo')).snapshotChanges().pipe(map(resp=>resp.map(a=>{
      const data= a.payload.doc.data() as Usuario;
      const  id = a.payload.doc.id;
      return { id, ...data};
    })
    ))
  }
  getUsuariosEstudiantes(){
    return this.afs.collection('usuarios', ref=>ref.where('rol','==', 'estudiante') ).snapshotChanges().pipe(map(resp=>resp.map(a=>{
      const data= a.payload.doc.data() as Usuario;
      const  id = a.payload.doc.id;
      return { id, ...data};
    })
    ))

  }
  getUsuariosEstudiantesinGroup(){
   
      return this.afs.collection('usuarios', ref=>ref.where('rol','==', 'estudiante')).snapshotChanges().pipe(map(resp=>resp.map(a=>{
        const data= a.payload.doc.data() as Usuario;
        const  id = a.payload.doc.id;
        return { id, ...data};
      })
      ))
   
  }
  agregarGrupo(id:string,gid:string ){
    this.afs.doc(`usuarios/${id}`).update({
      grupos: firebase.firestore.FieldValue.arrayUnion(gid)
    });
   
  }
  eliminarGrupo(id:string,gid:string){
    this.afs.doc(`usuarios/${id}`).update({
      grupos: firebase.firestore.FieldValue.arrayRemove(gid)
    });
  }
  eliminarMienbros(id:string,uid:string){
    this.afs.doc(`grupos/${id}`).update({
      mienbros: firebase.firestore.FieldValue.arrayRemove(uid)
    });
  }

  updateUserwithImg(imagen:FileItem[], uid:string){
    return this.almacenarArchivos(imagen,'perfiles').then(resp=>{
      this.afs.doc(`usuarios/${uid}`).update({
        photoURL:resp
      });
    });
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
        var fec= new Date().getTime();
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
                  
                  return resolve(images);
                }
              }
         );
       }
      }
    )
}
actuliazarCuentaUsuario(usuario:Usuario){
  return this.afs.doc(`usuarios/${usuario.uid}`).update({
     nombre:usuario.nombre,
     apellido:usuario.apellido,
     fechanacimiento:usuario.fechanacimiento,
     genero:usuario.genero,
     carrera:usuario.carrera
   });
 }
}
