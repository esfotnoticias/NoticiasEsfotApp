import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { TodoService } from 'src/app/services/todo.service';
import {File} from '@ionic-native/File/ngx'
import {FileTransfer} from '@ionic-native/file-transfer/ngx';
import {FileOpener} from '@ionic-native/file-opener/ngx';
import { DocumentViewer} from '@ionic-native/document-viewer/ngx';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/services/auth.service';
import { Publicacion, Usuario } from '../../Interfaces/interfaces';
@Component({
  selector: 'app-tab7',
  templateUrl: './tab7.page.html',
  styleUrls: ['./tab7.page.scss'],
})
export class Tab7Page implements OnInit {
  idPublicacion = null;
  publicacion: Publicacion = {};
  existe=false;
  valor=false;
  valor1=false;
  doc:number;
  vid:number;
  images:number;
  perfil=false;
  acceso="";
  public user$:Observable<any>= this.auth.afAuth.user;
  usuario:Usuario=new Usuario();
  constructor(private activatedRoute: ActivatedRoute,
    private todoService: TodoService,
    private platform:Platform, private file:File,
    private ft:FileTransfer, private fileOpener: FileOpener,
    private document:DocumentViewer,
    private youtube: YoutubeVideoPlayer,
    private auth:AuthService,
    ) { 
      this.user$.subscribe(resp=>{
        this.auth.getUser(resp.uid).subscribe(resp=>{
        
          if(resp!=undefined){
            
            this.usuario=resp;
            this.valor=true;
            if(this.usuario.photoURL.length!=0){
              this.perfil=true;
            }else{
              this.perfil=false;
            }
          }
        })
      })
    }

  ngOnInit() {
    this.idPublicacion = this.activatedRoute.snapshot.paramMap.get('id');
    this.acceso = this.activatedRoute.snapshot.paramMap.get('cod');
    this.obtenerPublicacion();
  }
  obtenerPublicacion(){
    this.todoService.getPublicacion(this.idPublicacion).subscribe( resp => {
      if(resp){
        
        this.valor1=true;
        
        this.publicacion = resp;
        if(resp!=null || resp!=undefined){
          this.existe=true;
          this.images=this.publicacion.imagenPost.length;
          this.doc=this.publicacion.docsPost.length;
          this.vid=this.publicacion.ytUrlPost.length;
        }else{
          this.existe=false;
        }
        
      }
     
    });
  }
  dowloadOpenPdf(url:any){
    let dowloadUrl=url.url;
    let path= this.file.dataDirectory;
    const tranfer=this.ft.create();
    var d= new Date();
    tranfer.download(dowloadUrl, `${path}${d}myFile.pdf`).then(entry=>{
      
      let url=entry.nativeURL;
      if(this.platform.is('ios')){
        this.document.viewDocument(url, 'application/pdf', {});
      }else{
        this.fileOpener.open(url, 'application/pdf')
      }
    });

  }
  watch(url:string){
    var size=url.length;

    if(this.busquedaString('?v=',url)!=-1){
      var i=this.busquedaString('?v=',url) +3;
      if(this.busquedaString('&ab_channel=',url)!=-1){
        var num=this.busquedaString('&ab_channel=',url);
        var substr=url.substring(i,num);
        this.youtube.openVideo( substr);
        return;
      }else{
        var substr=url.substring(i,size);
        this.youtube.openVideo( substr);
      }
  }else if(this.busquedaString('youtu.be/',url)!=-1){
    var i=this.busquedaString('youtu.be/',url)+9;
    var substr= url.substring(i, size);
    this.youtube.openVideo( substr);
  }else{
    return "";
  }
    
  }
  busquedaString(re:string, str:string) {
    var valor:number;
    if (str.indexOf(re) != -1) {
      valor=str.indexOf(re);
    } else {
      valor=-1;
    }
    return valor;
  }

}
