import { Component, OnInit ,ElementRef,Renderer2,ViewChild, QueryList, ViewChildren} from '@angular/core';
import {NgForm ,FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Grupos, Notificacion } from 'src/app/Interfaces/interfaces';
import { MyErrorStateMatcher,errorMessages } from 'src/app/Interfaces/interfaces';
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario } from 'src/app/Interfaces/interfaces';
import { GruposService } from 'src/app/services/grupos.service';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs/internal/Observable';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatTabGroup } from '@angular/material/tabs';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { NoticacionesService } from 'src/app/services/noticaciones.service';
import { MessagingService } from 'src/app/services/messaging.service';
import { isNullOrUndefined } from 'util';
@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {
  public user$:Observable<any>= this.auth.afAuth.user;
  firstFormGroup: FormGroup;
  forma: FormGroup;
  errors = errorMessages;
  error=false;
  matcher = new MyErrorStateMatcher();
  group:Grupos=new Grupos;
  changeGroup:Grupos=new Grupos;
  vergrupo:Grupos=new Grupos;
  mienbros:string[]=[];
  userGroup:Usuario[]=[];
  usuario:Usuario=new Usuario();
  idGroup:string;
  ruta:string;
  valor=false;
  valor1=false;
  primerpaso=false;
  tamanioError=false;
  mensajeerror:string="";
  mensaje=false;
  mensaje2=false;
  displayedColumns: string[] = ['codigo', 'name', 'mienbros','action'];
  dataSource = new MatTableDataSource();
  modGrupo=0;
  perfil=false;
  notificacion:Notificacion=new Notificacion();
  vacio=false;
  vacio2=false;
  vacio3=false;
  vacio4=false;
  vacio5=false;
  vacio6=false;
  displayedColumns2: string[] = [ 'apellido', 'email','actions'];
  displayedColumns3: string[] = [ 'apellido', 'email','actions'];
  displayedColumns4: string[] = [ 'apellido', 'email','actions'];
  displayedColumns5: string[] = [ 'apellido', 'email','actions'];
  displayedColumns6: string[] = ['nombre','action'];
  dataSource2: MatTableDataSource<Usuario>= new MatTableDataSource <Usuario>();
  dataSource3: MatTableDataSource<Usuario>= new MatTableDataSource <Usuario>();
  dataSource4: MatTableDataSource<Usuario>= new MatTableDataSource <Usuario>();
  dataSource5: MatTableDataSource<Usuario>= new MatTableDataSource <Usuario>();
  dataSource6 : MatTableDataSource<Grupos >= new MatTableDataSource <Grupos>();
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  matrizGroup:Grupos[]=[];
  @ViewChild(MatTabGroup, {static: false}) tab: MatTabGroup;
  constructor(private fb: FormBuilder,private renderer: Renderer2,private auth:AuthService,public alertController: AlertController,private message:MessagingService,private  noti:NoticacionesService,
    private activatedRoute:ActivatedRoute,private grupos: GruposService,private router:Router,public toastController: ToastController) { 
      this.user$.subscribe(resp=>{
        this.auth.getUser(resp.uid).subscribe(resp=>{
          
          if(resp!=undefined){
            
            this.usuario=resp;
            if(this.usuario.photoURL.length!=0){
              this.perfil=true;
            }else{
              this.perfil=false;
            }
            if(this.usuario!=undefined){
              this.valor=true;
              if(this.usuario.rol!="estudiante"){
                this.grupos.getGroupsOwner(this.usuario.uid).subscribe(
                  resp=>{
                   this.matrizGroup=resp;
                   this.dataSource.data=this.matrizGroup;
                   this.dataSource.paginator = this.paginator.toArray()[0];
                   
               })
              }else{
                this.grupos.getGroups().subscribe(res=>{
                  this.matrizGroup=res.filter(f=>f.idownerGroup!=this.usuario.uid && f.mienbros.includes(this.usuario.uid));
                  this.dataSource6 = new MatTableDataSource<Grupos>(res.filter(f=>f.idownerGroup!=this.usuario.uid && f.mienbros.includes(this.usuario.uid)));
                  this.dataSource6.paginator = this.paginator.toArray()[0];
                })
              }
      
            }
            
  
          }
        })
      })
     
      this.crearFormulario();
      
    }

  ngOnInit() {
  }
  ngAfterViewInit(){
}
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  if(filterValue==""){
    this.vacio=false;
  }else{
    this.vacio=true;
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }
}

applyFilter2(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  
  console.log(filterValue);
  if(filterValue==""){
    
    this.vacio2=false;
  }else{
    this.vacio2=true;
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }
}
applyFilter3(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  console.log(filterValue);
  if(filterValue==""){
    this.vacio3=false;
  }else{
    this.vacio3=true;
    this.dataSource3.filter = filterValue.trim().toLowerCase();
  }
  
}
applyFilter4(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  console.log(filterValue);
  if(filterValue==""){
    this.vacio4=false;
  }else{
    this.vacio4=true;
    this.dataSource4.filter = filterValue.trim().toLowerCase();
  }
}
applyFilter5(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  console.log(filterValue);
  if(filterValue==""){
    this.vacio5=false;
  }else{
    this.vacio5=true;
    this.dataSource5.filter = filterValue.trim().toLowerCase();
  }
}
applyFilter6(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  if(filterValue==""){
    this.vacio6=false;
  }else{
    this.vacio6=true;
    this.dataSource6.filter = filterValue.trim().toLowerCase();
  }
}



  crearFormulario(){
    this.firstFormGroup = this.fb.group({
      nameGroup: ['', [Validators.required,Validators.maxLength(15)]],
      detalleGroup:['', [Validators.required,Validators.maxLength(25)]],
      maxmienbrosGroup: ['', [Validators.required, Validators.max(20), Validators.min(1)]],
   });
   this.matcher = new MyErrorStateMatcher();
  }
  crearFormulario2(n:number){
    this.forma = this.fb.group({
      nameGroup: ['', [Validators.required,Validators.maxLength(15)]],
      detalleGroup:['', [Validators.required,Validators.maxLength(25)]],
      maxmienbrosGroup: ['', [Validators.required, Validators.max(20), Validators.min(n-1)]],
      idGroup: ['', Validators.required],
      
   });
   this.matcher = new MyErrorStateMatcher();
  }
  async onUpload(forma:FormGroup){
    if(this.firstFormGroup.invalid){
      return Object.values(this.firstFormGroup.controls).forEach(control=>{
        if (control instanceof FormGroup){
          Object.values(control.controls).forEach(control=>control.markAsTouched()) ;
          }else{
            control.markAsTouched();
          }
        });
  }else{
    if(this.usuario.grupos.length>8){
      this.tamanioError=true;
      setTimeout(()=>{                           
        this.tamanioError=false;
    }, 3000);
    }else{
      
      this.llenar(forma);
      
      this.grupos.guardarGrupo(this.group).then(rep=>{
        this.idGroup=rep.id;
        this.group.idg=rep.id;
        this.grupos.agregarGrupo(this.usuario.uid, rep.id);
        this.grupos.agregarMiembros(rep.id,this.usuario.uid);
        this.grupos.actualizarIdgGrupo(rep.id, this.idGroup);
        this.primerpaso=true;
      
        this.grupos.getGroup(rep.id).subscribe(resp=>{
          this.auth.getUsuariosEstudiantes().subscribe(res=>{
           this.dataSource2 = new MatTableDataSource<Usuario>(res.filter(f=>!resp.mienbros.includes(f.uid)&& (f.grupos.length<9)));
           this.dataSource2.paginator = this.paginator.toArray()[0];
           });
           this.auth.getUsuariosEstudiantesinGroup().subscribe(res=>{
             this.dataSource3 = new MatTableDataSource<Usuario>(res.filter(f=>resp.mienbros.includes(f.uid)));         
             this.dataSource3.paginator = this.paginator.toArray()[1];
             });
   
       })
        this.primerpaso=true;
        
      })
    }

  }
  }

  async cambiar(forma:FormGroup){
    if(this.forma.invalid){
      return Object.values(this.firstFormGroup.controls).forEach(control=>{
        if (control instanceof FormGroup){
          Object.values(control.controls).forEach(control=>control.markAsTouched()) ;
          }else{
            control.markAsTouched();
          }
        });
    }else{
        
        this.llenar2(forma);
        
        this.grupos.actualizarGrupo(this.group.idg,this.changeGroup ).then(rep=>{
          this.modGrupo=2;
          this.grupos.getGroup(this.group.idg).subscribe(resp=>{
            this.auth.getUsuariosEstudiantes().subscribe(res=>{
             this.dataSource4 = new MatTableDataSource<Usuario>(res.filter(f=>!resp.mienbros.includes(f.uid)&& (f.grupos.length<9)));
             this.dataSource4.paginator = this.paginator.toArray()[0];
             });
             this.auth.getUsuariosEstudiantesinGroup().subscribe(res=>{
               this.dataSource5 = new MatTableDataSource<Usuario>(res.filter(f=>resp.mienbros.includes(f.uid)));         
               this.dataSource5.paginator = this.paginator.toArray()[1];
               });
     
         })
          
          
        })
    

  }
  }


  agregarUser(uid:string){
 
    if(this.group.mienbros.length<this.group.maxmienbrosGroup){
      this.grupos.agregarMiembros(this.group.idg ,uid);
      this.auth.agregarGrupo(uid, this.group.idg);
      this.enviarNotificacion(uid);
    }else{
      this.error=true;
      setTimeout(() => {
        this.error=false;
      }, 3000);
    }
  

  }
  devolverUser(uid:string){
    
    this.grupos.eliminarMienbros(this.group.idg ,uid);
    this.auth.eliminarGrupo(uid, this.group.idg);
    this.enviarNotificacion2(uid);
  }
  llenar(forma:FormGroup){
    this.group.nameGroup=forma.get('nameGroup').value;
    this.group.maxmienbrosGroup=forma.get('maxmienbrosGroup').value+1;
    this.group.detalleGroup=forma.get('detalleGroup').value;
    this.group.idownerGroup=this.usuario.uid;
    this.group.idGroup=this.grupos.makeid();
  }
  llenar2(forma:FormGroup){
  this.changeGroup.nameGroup=forma.get('nameGroup').value;
  this.changeGroup.maxmienbrosGroup=forma.get('maxmienbrosGroup').value+1;
  this.changeGroup.detalleGroup=forma.get('detalleGroup').value;
  this.changeGroup.idGroup=forma.get('idGroup').value;
  }

  fe(idg:string){
    this.presentAlertConfirm(idg).then(resp=>{
      
    })

    
  }
  async presentAlertConfirm( idg:string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Eliminar grupo!',
      message: '¿Está seguro de realizar esta acción?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            

          }
        }, {
          text: 'Borrar',
          handler: () => {
            this.grupos.getGroup(idg).subscribe(resp=>{
             
              if(resp!=undefined){
               
                this.grupos.eliminarGrupoDefi(resp.mienbros,idg);
                setTimeout(() => {
                  this.presentToast('El grupo se ha borrado');
                }, 2000);
                
              }
            
            })

            
          }
        }
      ]
    });

    await alert.present();
  }

  onTabChanged(event){
    if(event.index==0){
      if(event.tab.textLabel=="Crear un Grupo"){
        this.modGrupo=0;
      }
      
    }else{
      if(event.tab.textLabel=="Mis Grupos"){
        this.primerpaso=false;
        this.resetiar();
      }
    }
    
  }

  modificar(uid:string){
    
    this.modGrupo=1;
   
    this.modificarGrupo(uid);
  }

  modificarGrupo(id:string){
    this.grupos.getGroup(id).subscribe(resp=>{
      this.group=resp;
      this.auth.getUser(resp.idownerGroup).subscribe(
        resp=>{
          this.usuario=resp; 
        
        
     }
   );
      if(resp){
        this.valor1=true;
        this.crearFormulario2(this.group.maxmienbrosGroup);
        this.cargarData(this.group);
      }   
  }
  )
  }

  cargarData(grupos:Grupos){
    this.forma.reset({
      "nameGroup": grupos.nameGroup,
      "detalleGroup": grupos.detalleGroup,
      "maxmienbrosGroup": grupos.maxmienbrosGroup-1,
      "idGroup":grupos.idGroup
    });
  }
  resetiar(){
    this.firstFormGroup.reset({
      "nameGroup": "",
      "detalleGroup": "",
      "maxmienbrosGroup":"",
    });
  }
  generar(){
    this.forma.get('idGroup').setValue(this.grupos.makeid());
  }
  regresar(){
   
    this.modGrupo=0;

  }
  finalizar(){
    
    this.modGrupo=0;
    this.presentToast('Has modificado un grupo');
  }
  finalizar2(){
    this.primerpaso=false;
    this.resetiar();
    this.tab.selectedIndex=1;
    this.presentToast('Ha creado un grupo');

  }
  join(form: NgForm){
    if(form.invalid){
      
      if(form.invalid){
        Object.values(form.controls).forEach(control=>{
          
          control.markAsTouched();
        })
        return
      }
    }else{
      if(this.usuario.grupos.length<9){
        var respues$=this.grupos.probar(this.group.idGroup).subscribe(resp=>{
         
          var valor=resp.length;
          if(valor!=0){
            this.group=resp[0];
            var leng=resp[0].mienbros.length;
            if(leng<=resp[0].maxmienbrosGroup){
              var i=resp[0].mienbros.indexOf(this.usuario.uid);
              if(i==-1){
                
                this.grupos.agregarMiembros(resp[0].id,this.usuario.uid);
                this.auth.agregarGrupo(this.usuario.uid,resp[0].id);
                this.enviarNotificacion3(resp[0].idownerGroup);
                respues$.unsubscribe();
                this.mensaje2=true;
                setTimeout(() => {
                  this.mensaje2=false;
                }, 3000);
                this.presentToast('Se ha registrado con éxito');
                this.group.idGroup="";
                
                return;
              }else{
                respues$.unsubscribe();
                this.mensaje=true;
                setTimeout(() => {
                  this.mensaje=false;
                }, 3000);
                this.mensajeerror="Usted ya está registrado";
              }
             
            }else{
              this.mensaje=true;
              setTimeout(() => {
                this.mensaje=false;
              }, 3000);
              this.mensajeerror="El grupo ya está completo";
            }
          }else{
           this.mensaje=true;
           setTimeout(() => {
            this.mensaje=false;
          }, 3000);
           this.mensajeerror="Código no válido";
           respues$.unsubscribe();
          }
          

         });
      }else{
        this.mensaje=true;
        setTimeout(() => {
         this.mensaje=false;
       }, 3000);
        this.mensajeerror="Has pasado el limite de grupos a cuales te puede unir 8";
      }
         
  

    }
  }
  devolverUserEs(index:number){
    this.presentAlertConfirm2(this.matrizGroup[index].idg,this.usuario.uid).then(resp=>{
      
    })
  }
  async presentAlertConfirm2( idg:string, uid:string) {
    
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Salir de este grupo!',
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
          text: 'Borrar',
          handler: () => {
            
            this.grupos.eliminarMienbros(idg,this.usuario.uid);
            this.auth.eliminarGrupo(this.usuario.uid, idg);
            setTimeout(() => {
              this.presentToast('Has salido del grupo');
            },2000);
            
            
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast( mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }
  llenarNotify(usuario:Usuario, grupo:Grupos){
    this.notificacion.iduc=usuario.uid;
    this.notificacion.tipo="";
    this.notificacion.acceso="group";
    this.notificacion.idp=usuario.uid;
    this.notificacion.autorimagenNot="https://firebasestorage.googleapis.com/v0/b/noticias-esfot.appspot.com/o/default%2Fgrupos.jpg?alt=media&token=a55109ea-a7d9-4bbe-b088-1302d117f17f";
    this.notificacion.codigo="";
    this.notificacion.mensaje="Te han agregado al grupo"+" "+ grupo.nameGroup;
   }
   llenarNotify2(usuario:Usuario, grupo:Grupos){
    this.notificacion.iduc=usuario.uid;
    this.notificacion.tipo="";
    this.notificacion.acceso="group";
    this.notificacion.idp=usuario.uid;
    this.notificacion.autorimagenNot="https://firebasestorage.googleapis.com/v0/b/noticias-esfot.appspot.com/o/default%2Fgrupos.jpg?alt=media&token=a55109ea-a7d9-4bbe-b088-1302d117f17f";
    this.notificacion.codigo="";
    this.notificacion.mensaje="Te han eliminado del grupo"+" "+ grupo.nameGroup;
   }
   llenarNotify3(usuario:Usuario, grupo:Grupos){
    this.notificacion.iduc=usuario.uid;
    this.notificacion.tipo="";
    this.notificacion.acceso="group";
    this.notificacion.idp=usuario.uid;
    this.notificacion.autorimagenNot="https://firebasestorage.googleapis.com/v0/b/noticias-esfot.appspot.com/o/default%2Fgrupos.jpg?alt=media&token=a55109ea-a7d9-4bbe-b088-1302d117f17f";
    this.notificacion.codigo="";
    this.notificacion.mensaje=usuario.nombre+" "+usuario.apellido+ " "+"se ha unido a tu grupo"+" "+grupo.nameGroup;
   }
   
   enviarNotificacion(id:string){
    
     var $user=this.auth.getUser(id).subscribe(resp=>{
       if(resp){
        
         this.llenarNotify(resp, this.group);
         this.noti.guardarNoti(resp.uid,this.notificacion);
         this.message.sendPostRequest(this.notificacion.mensaje, resp.token).toPromise().then(()=>{}).catch(err=>{});
         $user.unsubscribe;
       }
     })
  }
  enviarNotificacion2(id:string){
    
     var $user=this.auth.getUser(id).subscribe(resp=>{
       if(resp){
         
         this.llenarNotify2(resp, this.group);
         this.noti.guardarNoti(resp.uid,this.notificacion);
         this.message.sendPostRequest(this.notificacion.mensaje, resp.token).toPromise().then(()=>{}).catch(err=>{});
         $user.unsubscribe;
       }
     })
  }
  enviarNotificacion3(id:string){
   
     var $user=this.auth.getUser(id).subscribe(resp=>{
       if(resp){
         
         this.llenarNotify3(resp, this.group);
         this.noti.guardarNoti(resp.uid,this.notificacion);
         this.message.sendPostRequest(this.notificacion.mensaje, resp.token).toPromise().then(()=>{}).catch(err=>{});
         $user.unsubscribe;
       }
     })
  }
  
}
