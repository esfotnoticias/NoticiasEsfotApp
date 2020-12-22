import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FileItem, Publicacion, Usuario, Notificacion,MyErrorStateMatcher,errorMessages } from '../../Interfaces/interfaces';
import { TodoService } from '../../services/todo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { pipe, Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import {FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';
import { GruposService } from 'src/app/services/grupos.service';
import { Grupos } from 'src/app/Interfaces/interfaces';
import { IonSlides} from '@ionic/angular';
import { MessagingService } from 'src/app/services/messaging.service';
import { NoticacionesService } from 'src/app/services/noticaciones.service';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { ValidadoresService } from 'src/app/services/validadores.service';
declare var window: any;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})


export class Tab2Page implements AfterViewInit {
  @ViewChild('slidePrincipal') slides: IonSlides;
  imagesfi:FileItem[]=[];
  imagenprobar:string;
  publicar   : string[] = [];
  public usuario = new Usuario();
  errors = errorMessages;
  matcher = new MyErrorStateMatcher();
  firstFormGroup: FormGroup;
  image: string;
  imagePath: string;
  uploadPercent: Observable<number>;
  downloadUrl: Observable<string>;
  public ImageSource:any[]=[];
  secretaria:  string[] = ['Dirección ESFOT','Subdirección ESFOT'];
  public user$: Observable<any> = this.auth.afAuth.user;
  menu: boolean = false;
  images:Blob[]=[];
  imagesval:boolean=false;
  posteo:Publicacion=new Publicacion();
  conjuntoGrupos:Grupos[]=[];
  conjuntoGrupuosId:string[]=[];
  notificacion:Notificacion=new Notificacion();
  errorImagen=false;
  isLoading = false;
  perfil=false;
  valor=false;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private nav: NavController,
    private publicacionService: TodoService,
    private auth: AuthService,
    private camera: Camera,
    private file: File,
    private platform: Platform,
    private validaciones: ValidadoresService,
   public loadingController: LoadingController,
    private fb: FormBuilder,
    private grupos:GruposService,
    private message:MessagingService,
    private notification:NoticacionesService,
    public toastController: ToastController,
    private sanitizer:DomSanitizer) {

    this.user$.subscribe(resp => {
   
      if (resp != null) {
        this.menu = true;
        this.auth.getUser(resp.uid).subscribe(rep => {
         
         this.valor=true;
          this.usuario = rep;
          if(this.usuario.photoURL.length!=0){
            this.perfil=true;
          }else{
            this.perfil=false;
          }
          setTimeout(() => {
        
           this.llenarGrupos(this.usuario);
          }, 1000);
         
        });
      } else {
        this.menu = false;
      }

    });
  
    this.crearFormulario();
  }
  ngAfterViewInit(){

  }
  publicacion: Publicacion = {};
  tipoPublicacion = '';
  categoriaPublicacion = '';


  seleccionTipoPostNoticia() {
    var  publi=this.firstFormGroup.get('tipoPost').value;
    if (publi === 'Noticias') {
      return true;
    }
  }

  seleccionTipoPostAnuncio() {
    var  publi=this.firstFormGroup.get('tipoPost').value;
    if (publi === 'Solicitudes') {
      return true;
    }
  }

  seleccionTipoPostEvento() {
    var  publi=this.firstFormGroup.get('tipoPost').value;
    if (publi=== 'Eventos') {
      this.categoriaPublicacion = 'Eventos';
      return true;
    }
  }

  seleccionCateoriaPostEmergencia() {
    var  publi=this.firstFormGroup.get('categoriaPost').value;
    if (publi === 'Emergencia') {
      return true;
    }
  }

  crearFormulario(){
    this.firstFormGroup = this.fb.group({
     tituloPost: ['', Validators.required],
     tipoPost: ['', Validators.required],
     descripcionPost:['', Validators.required],
     fechaInicioPost: ['', Validators.required],
     fechaFinPost: [''],
     categoriaPost: ['', Validators.required],
     autorNamePost: ['', Validators.required],
     horainicioPost: [''],
     horafinPost: [''],
     telPost: ['', [Validators.pattern('^[0-9]+'),Validators.maxLength(10)]],
     lugarPost: [''],
     nameGroupPost: ['',[Validators.required]],
   },
   {
    validators: [this.validaciones.fechaMayor2('fechaInicioPost', 'fechaFinPost')]
   }
   );
  }
  validarRol(forma:FormGroup){
    if(this.usuario.rol=='secretaria'){
      this.posteo.autorNamePost=forma.get('autorNamePost').value;
      this.posteo.autorIdPost=this.usuario.uid;
      this.posteo.autorImagenPost='https://firebasestorage.googleapis.com/v0/b/noticias-esfot.appspot.com/o/default%2F09102020esfot01.jpg?alt=media&token=090239b5-ccae-4094-86cf-1af382854385';
      this.posteo.estadoPost='aprobado';
    }if(this.usuario.rol=='aeesfot'){
      forma.get('autorNamePost').setValue('AEESFOT');
      this.posteo.autorIdPost=this.usuario.uid;
      this.posteo.autorImagenPost='https://firebasestorage.googleapis.com/v0/b/noticias-esfot.appspot.com/o/default%2F09102020aeesfot01.png?alt=media&token=bf86ade7-868c-4b6e-a1de-1791b064b6e4';
      this.posteo.estadoPost='aprobado';
    }else if(this.usuario.rol=='estudiante'){
      forma.get('autorNamePost').setValue(this.usuario.nombre+" "+this.usuario.apellido);
      this.posteo.autorIdPost=this.usuario.uid;
      this.posteo.autorImagenPost=this.imagenUsuario(this.usuario);
      this.posteo.estadoPost='pendiente';
    }else if(this.usuario.rol=='administrador' || this.usuario.rol=='docente'){
      forma.get('autorNamePost').setValue(this.usuario.nombre+" "+this.usuario.apellido);
      this.posteo.autorIdPost=this.usuario.uid;
      this.posteo.autorImagenPost=this.imagenUsuario(this.usuario);
      this.posteo.estadoPost='aprobado';
    }
  }
  imagenUsuario(user:Usuario):string{
    if(user.photoURL.length!=0){
      return user.photoURL[0].url;
    }else{
      return "";
    }
  }
  validartipo(forma:FormGroup){
    var  publi=this.firstFormGroup.get('tipoPost').value;
    if(publi === 'Noticias'){
     
       forma.get('fechaFinPost').clearValidators()
       forma.get('fechaFinPost').updateValueAndValidity();
       forma.get('fechaInicioPost').clearValidators();
       forma.get('fechaInicioPost').updateValueAndValidity();

    }else if(publi === 'Eventos'){
       forma.get('categoriaPost').setValue('Eventos');
    
    }else if(publi === 'Solicitudes'){
     
      forma.get('fechaInicioPost').clearValidators();
      forma.get('fechaInicioPost').updateValueAndValidity();
      forma.get('fechaFinPost').clearValidators()
      forma.get('fechaFinPost').updateValueAndValidity();
      
    }
  }

  onUpload(forma:FormGroup){
    this.validarRol(forma);
    this.validartipo(forma);
    
    if(this.firstFormGroup.invalid){
     
     
      return Object.values(this.firstFormGroup.controls).forEach(control=>{
        if (control instanceof FormGroup){
          Object.values(control.controls).forEach(control=>control.markAsTouched()) ;
          }else{
            control.markAsTouched();
          }
        });
    }else{
      this.datosPost(forma);
     
      this.present();
       this.publicacionService.savePublicacion(this.posteo,this.imagesfi).then(resp=>{
        this.notificaciones(this.usuario,this.posteo, resp.id );
        this.llenarDatos(this.usuario);
        this.dismiss();
        this.presentToast('Se ha publicado el post con éxito')
  
        
      })
    }

  }
  datosPost(forma:FormGroup){
    this.posteo.tituloPost=forma.get('tituloPost').value;
    this.posteo.descripcionPost=forma.get('descripcionPost').value;
    this.posteo.fechaInicioPost=this.cambiarFecha(forma.get('fechaInicioPost').value);
    this.posteo.fechaFinPost=this.cambiarFecha(forma.get('fechaFinPost').value);
    this.posteo.autorNamePost=forma.get('autorNamePost').value;
    this.posteo.ytUrlPost=[];
    this.posteo.categoriaPost=forma.get('categoriaPost').value;
    this.posteo.horainicioPost=forma.get('horainicioPost').value;
    this.posteo.horafinPost=forma.get('horafinPost').value;
    this.posteo.lugarPost=forma.get('lugarPost').value;
    this.posteo.telPost=forma.get('telPost').value;
    this.posteo.nameGroupPost=this.publicar[forma.get('nameGroupPost').value];
    this.posteo.idGrupoPost=this.conjuntoGrupuosId[forma.get('nameGroupPost').value];
    this.posteo.comentarioPost="";
    this.posteo.docsPost=[];
    this.posteo.imagenPost=[];
    this.posteo.viewsPost=0;
    this.posteo.tipoPost=forma.get('tipoPost').value;
    
    

    
  }
  
  llenarDatos(user:Usuario){
    this.publicar=[];
    this.conjuntoGrupuosId=[];
    this.conjuntoGrupos=[];
    this.firstFormGroup.reset({
      tituloPost:"",
      descripcionPost:"",
      fechaInicioPost: "",
      fechaFinPost: "",
      horainicioPost: "",
      horafinPost: "",
      telPost: "",
      lugarPost: "",
      tipoPost:"",
      nameGroupPost: this.llenarGrupos(user),
       
    });
    this.images=[];
    this.imagesfi=[]; 
    this.ImageSource=[];
  }
  notificaciones(user:Usuario, publica:Publicacion, idp:string){
    this.llenarNotify(publica, idp);
    this.validarRolNoti(user);
    if(user.rol=='estudiante'){
      if(publica.idGrupoPost=='Global'){
         let $noti= this.auth.getUsuariosNotificarAdmins().subscribe(resp=>{
          let tamanio=resp.length;
          let i=0;
          for(let user of resp){
            i++;
            this.notification.guardarNoti(user.uid,this.notificacion);
            this.message.sendPostRequest(this.notificacion.mensaje, user.token).toPromise().then(()=>{}).catch(err=>{});
            if(i==tamanio){
               $noti.unsubscribe(); 
            }
          }
        })
      }else if(publica.idGrupoPost!='Global'){
        let $grup=this.grupos.getGroup(publica.idGrupoPost).subscribe(res=>{
          let $noti=this.auth.getUsuariosNotificarGroup(res.mienbros).subscribe(resp=>{
            let tamanio=resp.filter(re=>res.mienbros.includes(re.uid)&& re.uid!=user.uid).length;
            let i=0;
            for(let us of resp.filter(re=>res.mienbros.includes(re.uid)&& re.uid!=user.uid)){
             i++;
              
              this.notification.guardarNoti(us.uid,this.notificacion);
                this.message.sendPostRequest(this.notificacion.mensaje, us.token).toPromise().then(()=>{}).catch(err=>{});;
                if(i==tamanio){
                  $noti.unsubscribe();
                  $grup.unsubscribe();
                }
                
            }
          })
        })
      }
    }else if(user.rol!='estudiante'){
      if(publica.idGrupoPost =='Global'){
        let $noti=this.auth.getUsuariosNotificarAll().subscribe(resp=>{
            let i=0;
            let tamanio=resp.filter((resp)=>resp.uid!=user.uid).length;
           for(let us of resp.filter((resp)=>resp.uid!=user.uid)){
             i++;
             this.notification.guardarNoti(us.uid,this.notificacion);
             this.message.sendPostRequest(this.notificacion.mensaje, us.token).toPromise().then(()=>{}).catch(err=>{});
             if(i==tamanio){
                $noti.unsubscribe();
             }
            }
         })

      }else{
        let $grup=this.grupos.getGroup(publica.idGrupoPost).subscribe(res=>{
         
          let $noti=this.auth.getUsuariosNotificarGroup(res.mienbros ).subscribe(resp=>{
            let i=0;
            let tamanio=resp.filter(re=>res.mienbros.includes(re.uid) && re.uid!=user.uid).length;
            
            for(let us of resp.filter(re=>res.mienbros.includes(re.uid) && re.uid!=user.uid)){
              i++;
              this.notification.guardarNoti(us.uid,this.notificacion);
              this.message.sendPostRequest(this.notificacion.mensaje, us.token).toPromise().then(()=>{}).catch(err=>{});                
              if(i==tamanio){
                $noti.unsubscribe();
                $grup.unsubscribe();
              }
            }
          })
        })
      }
    }

  }
  llenarNotify( publica:Publicacion, idp:string){
    this.notificacion.iduc=this.posteo.autorIdPost;
    this.notificacion.tipo=this.posteo.tipoPost;
    if(this.usuario.rol==='estudiante'){
      this.notificacion.acceso="mody";
    }else{
      this.notificacion.acceso="vis";
    }
    
    this.notificacion.idp=idp;
   
    this.notificacion.codigo=this.llenarCodigoNotify(publica);
    this.notificacion.mensaje=this.llenarMensajeNotify(publica.tipoPost, publica);
 
    
   }
   validarRolNoti(user:Usuario){
    if(user.rol=='secretaria'){  
      this.notificacion.autorimagenNot='https://firebasestorage.googleapis.com/v0/b/noticias-esfot.appspot.com/o/default%2F09102020esfot01.jpg?alt=media&token=090239b5-ccae-4094-86cf-1af382854385';
    }if(user.rol=='aeesfot'){
      this.notificacion.autorimagenNot='https://firebasestorage.googleapis.com/v0/b/noticias-esfot.appspot.com/o/default%2F09102020aeesfot01.png?alt=media&token=bf86ade7-868c-4b6e-a1de-1791b064b6e4';   
    }else if(user.rol=='estudiante'){
      this.notificacion.autorimagenNot=this.imagenUsuario(user);
    }else if(user.rol=='administrador' || user.rol=='docente'){
      this.notificacion.autorimagenNot=this.imagenUsuario(user);  
    }
  }
  llenarMensajeNotify(tip:string, pst:Publicacion){
    var message:string;
    if(this.usuario.rol=='estudiante'){
      if(pst.idGrupoPost=='Global'){
        if(tip=='Noticias'){
          return message=pst.autorNamePost+" solicita la aprobación de su noticia"; 
        }else if(tip=='Eventos'){
          return message=pst.autorNamePost+"  solicita la aprobación de su evento";
        }else if(tip=='Solicitudes'){
          if(pst.categoriaPost=='Problema'){
            return message=pst.autorNamePost+" solicita la aprobación de su problema"; 
          }else if(pst.categoriaPost=='Emergencia'){
            return message=pst.autorNamePost+"  solicita la aprobación de su emergencia "; 
          }
        } 
    }else{
        if(tip=='Noticias'){
          return message=pst.autorNamePost+" solicita la aprobación de su noticia al grupo "+pst.nameGroupPost; 
        }else if(tip=='Eventos'){
          return message=pst.autorNamePost+" solicita la aprobación de su al grupo "+pst.nameGroupPost;
        }else if(tip=='Solicitudes'){
          if(pst.categoriaPost=='Problema'){
            return message=pst.autorNamePost+" solicita la aprobación de su problema al grupo"+pst.nameGroupPost; 
          }else if(pst.categoriaPost=='Emergencia'){
            return message=pst.autorNamePost+"  solicita la aprobación de su emergencia al grupo"+pst.nameGroupPost; 
          }
        } 
    }

    }else if(this.usuario.rol!='estudiante'){
        if(pst.idGrupoPost=='Global'){
          if(tip=='Noticias'){
            return message=pst.autorNamePost+"  publico una noticia"; 
          }else if(tip=='Eventos'){
            return message=pst.autorNamePost+"  publico un evento";
          }else if(tip=='Solicitudes'){
            if(pst.categoriaPost=='Problema'){
              return message=pst.autorNamePost+"  publico un problema"; 
            }else if(pst.categoriaPost=='Emergencia'){
              return message=pst.autorNamePost+"  publico una emergencia "; 
            }
            
          } 
      }else{
          if(tip=='Noticias'){
            return message=pst.autorNamePost+"  publico una noticia al grupo "+pst.nameGroupPost; 
          }else if(tip=='Eventos'){
            return message=pst.autorNamePost+"  publico un evento al grupo "+pst.nameGroupPost;
          }else if(tip=='Solicitudes'){
            if(pst.categoriaPost=='Problema'){
              return message=pst.autorNamePost+"  publico un problema al grupo"+pst.nameGroupPost; 
            }else if(pst.categoriaPost=='Emergencia'){
              return message=pst.autorNamePost+"  publico una emergencia al grupo"+pst.nameGroupPost; 
            }
          } 
      }
    }
    
  }

  llenarCodigoNotify(pst:Publicacion){
    
    var codi:string;
    if(pst.idGrupoPost=='Global'){
      return codi="gpglltsww1";
    }else{
      return codi="gpmbltswm1";
    }
  }
  llenarGrupos(user:Usuario){
    var subscriotion$=this.grupos.getGroupsUser(user.uid).subscribe(res=>{
         
          this.conjuntoGrupos=res.filter(res=>res.mienbros.includes(user.uid));;
          if(res.length==0){
           
              this.publicar.splice(0,1,'Global');
              this.conjuntoGrupuosId.splice(0,1,'Global')
              
              subscriotion$.unsubscribe;
          }else{
            
            this.publicar.splice(0,1,'Global');
            this.conjuntoGrupuosId.splice(0,1,'Global')
            var i=1;
            for(let item of  this.conjuntoGrupos){               
               this.publicar.splice(i,1,item.nameGroup);
               this.conjuntoGrupuosId.splice(i,1,item.idg);
               i=i+1;
            }
           
            subscriotion$.unsubscribe;
          }
    })
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
      
    }
    const path: string = fileURI.substring(0, fileURI.lastIndexOf('/'));

   

    const buffer: ArrayBuffer = await this.file.readAsArrayBuffer(path, file);
    const blob: Blob = new Blob([buffer], { type: 'image/jpeg' });
    if(this.ImageSource.length<5){
      
      this.images.push(blob);
      this.imagesval=true;
      const id = Math.random().toString(36).substring(2) +'.jpg';
      this.getImageFromService(blob,id);
    
    }
    
  

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
        if(this.ImageSource.length<5){
          this.images.push(blob);
          this.imagesval=true;
          const id = Math.random().toString(36).substring(2)+ '.jpg';
          this.getImageFromService(blob,id);
        }

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
          this.imagesfi.push(newFile);
           var unsafeImageUrl = URL.createObjectURL(blob);
          var imageUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
          this.ImageSource.push(imageUrl); 

        
         

    }

   eliminar(index:number){
     this.ImageSource.splice(index,1);
     this.imagesfi.splice(index,1);
     this.images.splice(index,1);

   }
  
   mostrarPubli() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(0);
    this.slides.lockSwipes(true);
  }

  mostrarImagenes() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(1);
    this.slides.lockSwipes(true);
  }
  cambiarFecha(date:string){
    if(date==undefined || date==null || date==""){
      return null;
    }else{
      let f1=new Date(date);
      return f1;
    }   
  }
  async presentToast( mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }
  async present() {
    this.isLoading = true;
    return await this.loadingController.create({
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss().then(() => console.log(''));
        }
      });
    });
    
  }
  async dismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }

}
