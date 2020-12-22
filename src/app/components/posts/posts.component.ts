import { Component, OnInit, Input } from '@angular/core';
import { Article, Publicacion } from '../../Interfaces/interfaces';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {

  @Input() posts: Article[] = [];
  @Input() publicaciones: Publicacion[] = [];

  constructor() { }

  ngOnInit() {
    
  }
}
