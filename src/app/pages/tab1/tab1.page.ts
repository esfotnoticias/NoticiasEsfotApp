import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { Article, Publicacion, Usuario } from '../../Interfaces/interfaces';
import { TodoService } from '../../services/todo.service';
import { IonSegment, IonSegmentButton } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { NoticacionesService } from 'src/app/services/noticaciones.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  @Input() publicacionesCateori: Publicacion = {};
  publicaciones: Publicacion[] = [];
  publicacionesCate: Publicacion[];
  habilitado = true;
  cargando=false;
  tipos = ['Noticias', 'Eventos'];
  valor=false;
  temp:any[]=[];
  textoBuscar = '';
  categ='Todos';
  public usuario = new Usuario();
  perfil=false;
  public user$: Observable <any> = this.auth.afAuth.user;
  tamanio=false;

  constructor(  private postsService: PostsService,
                private todoService: TodoService,
                private db: AngularFirestore,
                private auth: AuthService,
                private notificacion: NoticacionesService ) { 
                  this.user$.subscribe(resp=>{
                    var $au=this.auth.getUser(resp.uid).subscribe(res=>{
                      
                      if(res){
                        if(res.rol==undefined || res.estado==undefined){
                            $au.unsubscribe;
                            this.auth.getUser(resp.uid).subscribe(res=>{
                              this.usuario=res;
                              this.valor=true;
                              if(this.usuario!=undefined){
                                if(this.usuario.photoURL.length!=0){
                                  this.perfil=true;
                                }else{
                                  this.perfil=false;
                                }
                                this.todoService.getPost(res.grupos).subscribe(resu=>{  
                                  
                                  var i=0;
                                  this.publicaciones=resu.filter(r=>this.usuario.grupos.includes(r.idGrupoPost));
                                  if(resu){
                                    this.cargando=true;
                                    this.valor= true;
                                  }
                                  if(this.publicaciones.length!=0){
                                    this.tamanio=true;
                                  }else{
                                    this.tamanio=false;
                                  }                        
                                })
                              }
                            })
                        }else{
                          this.usuario=res;
                          this.valor=true;
                          if(this.usuario!=undefined){
                            if(this.usuario.photoURL.length!=0){
                              this.perfil=true;
                            }else{
                              this.perfil=false;
                            }
                            this.todoService.getPost(res.grupos).subscribe(resu=>{  
                             
                              var i=0;
                              this.publicaciones=resu.filter(r=>this.usuario.grupos.includes(r.idGrupoPost));
                              if(resu){
                                this.cargando=true;
                                this.valor= true;
                              }
                              if(this.publicaciones.length!=0){
                                this.tamanio=true;
                              }else{
                                this.tamanio=false;
                              }                        
                            })
                          }
                        }
                    
              
                      }
                      
                    })
                  })
                }


  ngOnInit() {
    
    
  }

  
  recargar(event) {
    this.cargando=false;
    this.valor= false;
    this.categ='Todos';
    
    this.todoService.getPost(this.usuario.grupos).subscribe(resu=>{  
     
      this.publicaciones=resu.filter(r=>this.usuario.grupos.includes(r.idGrupoPost));
      if(resu){
        event.target.complete();
        this.cargando=true;
        this.valor= true;
        return;
      }
      if(this.publicaciones.length!=0){
        this.tamanio=true;
        this.cargando=true;
      }else{
        this.tamanio=false;
        this.cargando=true;
      }                        
    })

  }





  EncabeadoCategoria( categoriaSeleccionada: string){
    
    this.todoService.getPublicaciones()
          .subscribe( resp => {
          this.publicaciones = resp;
          this.publicaciones = resp.filter(( resp ) => resp.tipoPost === categoriaSeleccionada );
          return this.publicaciones;
      });
  }

  buscar( event ){
    
    
    const valor = event.detail.value;
   
    this.todoService.getPostBusqueda(valor, this.categ, this.usuario.grupos).then(res=>{
      this.publicaciones=res;
      if(this.publicaciones.length!=0){
        this.tamanio=true;
      }else{
        this.tamanio=false;
      }
     
    });
  

  }
  selectCar(){
   
    if(this.categ=='Todos'){
      this.todoService.getPost(this.usuario.grupos).subscribe(resp=>{
          this.publicaciones=resp;
          var i=0;
          if(this.publicaciones.length!=0){
            this.tamanio=true;
          }else{
            this.tamanio=false;
          }
          for(var item of resp){
             this.publicaciones[i].idPost=item.id;
             i=i+1;
          }
      })
    }else{
      this.todoService.getPost(this.usuario.grupos).subscribe(resp=>{
          this.publicaciones=resp.filter((resp)=> resp.categoriaPost==this.categ);
          this.temp=resp.filter((resp)=> resp.categoriaPost==this.categ);
          var i=0;
          if(this.publicaciones.length!=0){
            this.tamanio=true;
          }else{
            this.tamanio=false;
          }
      })
    }
  }

}
