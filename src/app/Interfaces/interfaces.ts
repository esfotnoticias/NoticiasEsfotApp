import { Time } from '@angular/common';
import { Observable } from 'rxjs';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
export interface RespuestaPosts {
  posts: any;
  status: string;
  totalResults: number;
  articles: Article[];
}

export interface RespuestaPublicaciones {
  posts: any;
  status: string;
  totalResults: number;
  articles: Publicacion[];
}

export interface Article {
  source?: Source;
  author?: string;
  title?: string;
  description?: string;
  url?: string;
  urlToImage?: string;
  publishedAt?: string;
  content?: string;
}

export interface Source {
  id?: string;
  name?: string;
}


export interface User {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
}

export class Usuario {
  uid: string;
  email: string;
  nombre: string;
  apellido?: string;
  password?: string;
  rol: string;
  estado?: string;
  genero?:  string;
  fechanacimiento?:Date;
  usuarioVerificado: boolean;
  creado?: string;
  carrera?: string;
  photoURL?: any[];
  credencial?:any[];
  emailVerified: boolean;
  grupos?: string[];
  token?:string;
}


export class Publicacion {
  idPost?: string;
  tipoPost?: string;
  categoriaPost?: string;
  estadoPost?: string;
  tituloPost?: string;
  autorNamePost?: string;
  viewsPost?: number;
  fechaPost?: Date;
  fechaInicioPost?: Date;
  fechaFinPost?: Date;
  descripcionPost?: string;
  horainicioPost?: string;
  horafinPost?: string;
  telPost?: string;
  lugarPost?: string;
  imagenPost?: any[];
  autorIdPost?: string;
  autorImagenPost?: string;
  docsPost?: any[];
  ytUrlPost?: string[];
  comentarioPost?: string;
  idGrupoPost?:string;
  nameGroupPost?:string;
  

  }
 
  export class FileItem {
    public name: string;
    public archivo:Blob;
    public uploading:boolean;
    public uploadPercent: Observable<number>;
    public downloadURL: Observable<string>;
    public progreso: number;
    public url:string;
    constructor(public file: Blob, name:string) {
      this.archivo=file;
      this.name = name;
      this.progreso=0;
      this.uploading=false;
    }
  }
  export class Grupos {
    idg?:string;
    idGroup?:string;
    idownerGroup?:string;
    nameGroup:string;
    detalleGroup:string;
    maxmienbrosGroup?:number;
    mienbros?:string[]=[];

}
export class Notificacion {
  idnot?:string;
  idp?:string;
  iduc?:string;
  tipo?:string;
  autorimagenNot?:string;
  acceso?:string;
  codigo?:string;
  mensaje?:string;
  notFechaP?:Date;
  seeNot:boolean;
}
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
export const errorMessages: { [key: string]: string } = {

  maxEstudent:' Número maximo de estudiantes es 20',
  llenar:'El campo no puede estar vacío',
  links:'El link que ingreso es incorrecto',
  opcion:'Seleccione una opción el campo no puede estar vacío',
  perfilPost:'Seleccione un perfil',
  categoriaPost:'Seleccione una categoria de ',
  titulopost:'Ingrese el título de ',
  descripcionPost:'Ingrese una descripción para ',
  fechaPost:'Seleccion la fecha de inicio de',
  numeroPost:'Formato de número telefónico incorrecto',
  comenta: 'Agrega un comentario a',
  name: 'El nombre es necesario',
  apellido: 'El apellido es necesario',
  email:'El email es requerido',
  emailmal:'El email es erroneo',
  fecnac:'La fecha de nacimiento es requerida',
  genero: 'El genero es necesario',
  password:'La contraseña es requerida',
  password2:'Las contraseñas no coinciden',
  solotexto:'Solo letras mayúsculas y minúsculas',

};