import { Component, OnInit, Input } from '@angular/core';
import { Publicacion, Usuario } from '../../Interfaces/interfaces';
import { PostsService } from '../../services/posts.service';
import { TodoService } from '../../services/todo.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-emergencias',
  templateUrl: './emergencias.page.html',
  styleUrls: ['./emergencias.page.scss'],
})
export class EmergenciasPage implements OnInit {

  // posts: Article[] = [];
  publicaciones: Publicacion[] = [];
  publicacionesCate: Publicacion[];
  @Input() publicacionesCateori: Publicacion = {};
  habilitado = true;
  tipos = ['Todas', 'Aceptadas', 'Rechazadas'];
  textoBuscar = '';
  tabActual='Todas';
  public usuario = new Usuario();
  valor=false;
  perfil=false;
  pub=false;
  public user$: Observable <any> = this.auth.afAuth.user;


  constructor(  private postsService: PostsService,
                private todoService: TodoService,
                private db: AngularFirestore,
                private auth: AuthService ) {

                  this.user$.subscribe( resp => {
                 
                    this.auth.getUser( resp.uid ).subscribe( rep => {
                      
                      if(rep){
                        this.valor=true;
                        this.usuario = rep;
                        if(this.usuario.photoURL.length!=0){
                          this.perfil=true;
                        }else{
                          this.perfil=false;
                        }
                      }
                     
                     
                    });
                  });
                }

  ngOnInit() {
    this.EncabeadoCategoria('Todas');
  }


EncabeadoCategoria( valor: string){
  this.tabActual=valor;
  if ( valor === 'Todas'){
    this.todoService.getPublicacionesSol()
          .subscribe( resp => {
            
          this.publicaciones = resp;
          this.pub=true;
          return this.publicaciones;
        });
  }
  if ( valor === 'Aceptadas'){
    
    this.todoService.getPublicacionesSol()
          .subscribe( resp => {
          if(resp!=undefined){
            this.publicaciones = [];
            this.publicaciones = resp.filter(( resp ) =>  resp.autorIdPost === this.usuario.uid && resp.estadoPost === 'aprobado');
            this.pub=true;
          }
          return this.publicaciones;
        });
  }
  if ( valor === 'Rechazadas'){
   
    this.todoService.getPublicacionesSol()
          .subscribe( resp => {
          if(resp!=undefined){
            this.publicaciones = [];
            this.publicaciones = resp.filter(( resp ) => resp.autorIdPost === this.usuario.uid && resp.estadoPost === 'rechazado' );
            this.pub=true;
          }
          return this.publicaciones;
        });
  }
}


  recargar( event ) { 
    if ( this.tabActual === 'Todas'){
      this.todoService. getPublicacionesSol()
            .subscribe( resp => {
            this.publicaciones = resp;
            event.target.complete();
            if(resp!=undefined){
              this.pub=true;
            }
            return this.publicaciones;
          });
    }
    if ( this.tabActual === 'Aceptadas'){
      
      this.todoService. getPublicacionesSol()
            .subscribe( resp => {
            if(resp!=undefined){
              this.publicaciones = [];
              this.publicaciones = resp.filter(( resp ) => resp.autorIdPost === this.usuario.uid && resp.estadoPost === 'aprobado');
              this.pub=true;
            }
            
            event.target.complete();
            return this.publicaciones;
          });
    }
    if ( this.tabActual === 'Rechazadas'){
      
      this.todoService. getPublicacionesSol()
            .subscribe( resp => {
            if(resp!=undefined){
              this.publicaciones = [];
              this.publicaciones = resp.filter(( resp ) => resp.autorIdPost === this.usuario.uid && resp.estadoPost === 'rechazado' );
              this.pub=true;
            }
            event.target.complete(); 
            return this.publicaciones;
          });
    }

  }

  buscar( event ){
    const valor = event.detail.value;
    if(valor==""){
      this.EncabeadoCategoria(this.tabActual);
    }else{
      let pasar:Publicacion[]=this.busqueda(valor, this.publicaciones);
    this.publicaciones=pasar;
    }
    
   

  }
  busqueda(valor:string, publi:Publicacion[]){
    let resultado:Publicacion[]=[];
    let bus=valor.toLocaleLowerCase();
    for(let pub of publi){
      let pas=pub.tituloPost.toLocaleLowerCase();
      let valor1=pub.nameGroupPost.toLocaleLowerCase();
      if(pas.indexOf(bus)>=0 ||valor1.indexOf(bus)>=0 ){
        resultado.push(pub);
      }
    }
    return resultado;

  }

}
