import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Usuario, FileItem, MyErrorStateMatcher,errorMessages } from 'src/app/Interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { NavController, Platform } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { ToastController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { FormGroup,Validators, FormBuilder } from '@angular/forms';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  public user$: Observable <any> = this.auth.afAuth.user;
  public usuario = new Usuario();
  public ImageSource:any[]=[];
  image: string;
  imagenprobar:string;
  valor=false;
  perfil=false;
  usu$:Subscription;
  usuar$:Subscription;
  images:Blob[]=[];
  forma: FormGroup;
  errors = errorMessages;
  matcher = new MyErrorStateMatcher();
  constructor( private google: GooglePlus, private router:Router,private auth: AuthService,public actionSheetController: ActionSheetController, private fb:FormBuilder,
     private camera: Camera,private platform: Platform, private file: File,public alertController: AlertController,public toastController: ToastController) {
      this.usuar$=this.user$.subscribe(resp=>{
      this.usu$= this.auth.getUser(resp.uid).subscribe(resp=>{
        if(resp!=undefined){
          this.valor=true;
          this.usuario=resp;
          this.crearFormulario();
          this.llenar();
          if(this.usuario.photoURL.length!=0){
            this.perfil=true;
          }else{
            this.perfil=false;
          }
        }
    })
  })
  }
  navegar(){
    this.presentAlertConfirm();
 
  }
  menu(){
    this.presentActionSheet().then(resp=>{

    })
  }
  crearFormulario(){
    this.forma=this.fb.group({
      nombre  :['',[Validators.required,Validators.pattern('[a-zA-Z ]{0,20}')] ],
      apellido:['',[Validators.required,Validators.pattern('[a-zA-Z ]{0,20}')]],
      genero: ['',Validators.required],
      fechanacimiento:['',[Validators.required]],
      carrera:['',Validators.required],
   }
   );
  }
  cleanValidatorCarrera(user:Usuario,forma:FormGroup){
    if(user.rol=='secretaria'){
      forma.get('carrera').clearValidators()
      forma.get('carrera').updateValueAndValidity();
      this.usuario.carrera=user.carrera;
    }if(user.rol=='aeesfot'){
       this.usuario.carrera=forma.get('carrera').value;
    }else if(user.rol=='estudiante'){
      this.usuario.carrera=forma.get('carrera').value;
    }else if(user.rol=='administrador'){
      forma.get('carrera').clearValidators()
      forma.get('carrera').updateValueAndValidity();
      this.usuario.carrera=user.carrera;
    }else if(user.rol=='docente'){
      this.usuario.carrera=forma.get('carrera').value;
    }else if(user.rol=='invitado'){
      forma.get('carrera').clearValidators()
      forma.get('carrera').updateValueAndValidity();
      this.usuario.carrera=user.carrera;
    }
   }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Seleccionar',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Galeria',
        role: 'destructive',
        icon: 'images-outline',
        handler: () => {
          this.libreria();
          console.log('Delete clicked');
        }
      }, {
        text: 'Foto',
        icon: 'camera-outline',
        handler: () => {
          console.log('Share clicked');
          this.camara();
        }
      }, 
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
  async camara() {
    
    const cameraPhoto = await this.openCamera();
    this.ImageSource
    this.image = cameraPhoto;
    

    const fileURI = this.image;
    let file: string;
    this.imagenprobar=file
    if (this.platform.is('ios')) {
      file = fileURI.split('/').pop();
    } else {
      file = fileURI.substring(fileURI.lastIndexOf('/') + 1);
      console.log(file);
    }
    const path: string = fileURI.substring(0, fileURI.lastIndexOf('/'));

    

    const buffer: ArrayBuffer = await this.file.readAsArrayBuffer(path, file);
    const blob: Blob = new Blob([buffer], { type: 'image/jpeg' });
    this.images.push(blob);
    const id = Math.random().toString(36).substring(2) +'.jpg';
    this.getImageFromService(blob,id);    
  }
  async openCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1000,
      targetHeight: 1000,
      sourceType: this.camera.PictureSourceType.CAMERA
    };
    return await this.camera.getPicture(options);
  }
  async libreria(){

    const libraryImage = await this.openLibrary();
        this.image = libraryImage;
        
        const fileURI = this.image;
        let file: string;
        if (this.platform.is('ios')) {
          file = fileURI.split('/').pop();
        } else {
          file = fileURI.substring(fileURI.lastIndexOf('/') + 1, fileURI.indexOf('?'));
          
        }
        const path: string = fileURI.substring(0, fileURI.lastIndexOf('/'));
        
        const buffer: ArrayBuffer = await this.file.readAsArrayBuffer(path, file);
        const blob: Blob = new Blob([buffer], { type: 'image/jpeg' });
        const id = Math.random().toString(36).substring(2)+ '.jpg';
          this.getImageFromService(blob,id);
  }
  async openLibrary() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1000,
      targetHeight: 1000,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };
    return await this.camera.getPicture(options);
  }
  getImageFromService(blob:Blob, name:string) {
       
   
    const newFile= new FileItem(blob,name);
    var arra:FileItem[]=[]
    arra.splice(0,1,newFile);
    this.auth.updateUserwithImg( arra,this.usuario.uid).then(resp=>{
        this.presentToast('Se ha cambiado la foto!');
    });
}
  async presentToast( mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }
  cambio(  form:FormGroup ){
    this.cleanValidatorCarrera(this.usuario,form);
    if(form.invalid){
      Object.values(form.controls).forEach(control=>{
        
          control.markAsTouched();
        })
        return
      }
      try{
   
        this.datosPost(form);
       
          this.auth.actuliazarCuentaUsuario(this.usuario).then(resp=>{
          this.llenar();
          this.presentToast('Actualizo su datos');
          
        })  
      }catch(err){

      }
    
  }
  llenar(){
    if(this.usuario.fechanacimiento!= null){
      
      var d=parseInt(this.usuario.fechanacimiento['seconds']);
      var s:Date = new Date(d*1000);
      console.log(s);
      var fec=s;
    }
    this.forma.reset({
      nombre  :this.usuario.nombre,
      apellido:this.usuario.apellido,
      genero: this.usuario.genero,
      fechanacimiento: fec,
      carrera: this.usuario.carrera
    })
  }
 
  cambiarFecha(date:string){
   
    if(date==undefined || date==null || date==""){
      return null;
    }else{
      
      let f1=new Date(date);
      return f1;
    }   
  }
  datosPost(forma:FormGroup){
    this.usuario.nombre=forma.get('nombre').value;
    this.usuario.apellido=forma.get('apellido').value;   
     this.usuario.fechanacimiento=forma.get('fechanacimiento').value;
    this.usuario.genero=forma.get('genero').value;
  }
  reversaFecha(){

  }

  async presentAlertConfirm() {
  
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Cerrar sesión!',
      message: '¿Está seguro de realizar esta acción?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');

          }
        }, {
          text: 'Salir',
          handler: () => {
       
            if(this.usuario.rol=='invitado'){
              this.auth.actualizarTokenUser(this.usuario.uid, "").then(res=>{});
              this.google.disconnect();
              this.auth.logout1();
              this.router.navigate[('/login')];
              this.presentToast('Ha cerrado sesión');
              
            }else{
            
              this.auth.actualizarTokenUser(this.usuario.uid, "").then(res=>{});
              this.auth.logout1();
              this.presentToast('Ha cerrado sesión');
              this.router.navigate(['/login']);
              
             
              
            }
    
          }
        }
      ]
    });

    await alert.present();
  }

}
