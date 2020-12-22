import { Component, OnInit, Input } from '@angular/core';
import { Publicacion } from '../../Interfaces/interfaces';
import { ActivatedRoute } from '@angular/router';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-detalle-publicacion',
  templateUrl: './detalle-publicacion.page.html',
  styleUrls: ['./detalle-publicacion.page.scss'],
})
export class DetallePublicacionPage implements OnInit {

  // @Input() publicacion: Publicacion = {};

  idPublicacion = null;
  publicacion: Publicacion = {};
  existe:boolean;
  valor=false;
  constructor(  private activatedRoute: ActivatedRoute,
                private todoService: TodoService
                 ) { }

  ngOnInit() {

    // this.fcm.subscribeToTopic('marketing');

    // this.fcm.getToken().then(token => {

   //  });


    this.idPublicacion = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.idPublicacion);
    this.obtenerPublicacion();
  }

  obtenerPublicacion(){
    this.todoService.getPublicacion(this.idPublicacion).subscribe( resp => {
      if(resp){
        this.valor=true;
        console.log('ESTO', resp );
        this.existe=true;
        this.publicacion = resp;
      }else{
        this.existe=false
        console.log('ya no existe');
      }
     
    });
  }

}
