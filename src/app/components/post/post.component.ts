import { Component, OnInit, Input } from '@angular/core';
import { Article, Publicacion } from '../../Interfaces/interfaces';;
import { RouterModule, Router } from '@angular/router';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {

  @Input() post: Article = {};
  @Input() publicacion: Publicacion = {};
  imagenes=false;


  constructor( private publicaciones:TodoService,
                private router: Router ) { }

  ngOnInit() {
    if(this.publicacion.imagenPost.length!=0){
      this.imagenes=true;
    }else{
      this.imagenes=false;

    }
  }

  navegar(){
    this.publicaciones.updateViews(this.publicacion.idPost, this.publicacion.viewsPost);
    this.router.navigate(['/main/tabs/tab7', this.publicacion.idPost ]);
    // , this.publicacion.idPost

  }
}
