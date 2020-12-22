import { Pipe, PipeTransform } from '@angular/core';
import { isNullOrUndefined } from 'util';
@Pipe({
  name: 'viewtime'
})
export class ViewtimePipe implements PipeTransform {
  d= new Date();
  transform(fecha: any): any {
    console.log(fecha+'es lo que entra');
    if(isNullOrUndefined(fecha)){
      return '';
    }else{
      var d =parseInt(fecha['seconds']);
      var s =new Date(d*1000);
      var i=s.getFullYear();
      var j=s.getMonth();
      var r=s.getDate();
      var p=i+"/"+j+"/"+r;
      console.log(i,j,r,p);
      return p;
    }
  }
}
