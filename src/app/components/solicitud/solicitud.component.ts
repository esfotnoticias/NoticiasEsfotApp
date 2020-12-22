import { Component, OnInit, Input } from '@angular/core';
import { Article, Publicacion } from '../../Interfaces/interfaces';;
import { RouterModule, Router } from '@angular/router';
import { TodoService } from 'src/app/services/todo.service';
@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.scss'],
})
export class SolicitudComponent implements OnInit {
  @Input() post: Article = {};
  @Input() publicacion: Publicacion = {};
  imagenes=false;
  cod="come";
  constructor(private publicaciones:TodoService,
    private router: Router) { }

  ngOnInit() {
    if(this.publicacion.imagenPost.length!=0){
      this.imagenes=true;
    }else{
      this.imagenes=false;

    }
  }

  navegar(){
   
    this.router.navigate(['/main/tabs/tab7', this.publicacion.idPost, this.cod ]);
    

  }
}
