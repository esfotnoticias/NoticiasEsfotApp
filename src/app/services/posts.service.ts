import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RespuestaPosts } from '../Interfaces/interfaces';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  paginaPosts = 0;


  constructor( private http: HttpClient ) {}

    getPosts( pull: boolean = false) {

      if ( pull ) {

        this.paginaPosts = 0;
      }

      this.paginaPosts ++;

    // tslint:disable-next-line: max-line-length
      return this.http.get<RespuestaPosts>( `${URL}` );

  }
}
