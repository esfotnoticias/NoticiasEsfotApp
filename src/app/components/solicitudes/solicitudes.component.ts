import { Component, Input, OnInit } from '@angular/core';
import { Article, Publicacion } from '../../Interfaces/interfaces';
@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss'],
})
export class SolicitudesComponent implements OnInit {

  @Input() posts: Article[] = [];
  @Input() publicaciones: Publicacion[] = [];
  constructor() { }

  ngOnInit() {}

}
