import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textoPortada'
})
export class TextoPortadaPipe implements PipeTransform {

  transform(texto: string): string {
    if(texto.length>128){
      var num=this.SearchPointSpace(texto);
     // console.log(num +'numero de link');
      return texto.substr(0,num) +" ...";
    }else{
      return texto;
    }

  }
  SearchPointSpace(texto:string){
    var par=texto.substr(0,128);
      for(var i=128;i>0;i--){
          if(par.charAt(i)=="."|| par.charAt(i)==" "){
            return i;
          
          }else{
            continue;
          }
      }
  }

}
