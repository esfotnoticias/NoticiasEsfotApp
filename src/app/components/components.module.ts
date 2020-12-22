import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from './post/post.component';
import { PostsComponent } from './posts/posts.component';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../pipes/pipes.module';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { NotificacionComponent } from './notificacion/notificacion.component';
import { SolicitudComponent } from './solicitud/solicitud.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';



@NgModule({
  declarations: [
    PostComponent,
    PostsComponent,
    NotificacionesComponent,
    NotificacionComponent,
    SolicitudComponent,
    SolicitudesComponent

  ],
  exports: [
    PostsComponent,
    NotificacionesComponent,
    NotificacionComponent,
    SolicitudComponent,
    SolicitudesComponent

  ],
  imports: [
    CommonModule,
    IonicModule,
    PipesModule
  ]
})
export class ComponentsModule { }
