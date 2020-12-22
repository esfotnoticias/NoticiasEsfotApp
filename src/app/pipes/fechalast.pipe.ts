import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechalast'
})
export class FechalastPipe implements PipeTransform {
  d= new Date();
  fechaRed= new Date();
  transform(fecha: any): any {
  
    if(fecha!=undefined){
      var d =parseInt(fecha['seconds']);
      var s =new Date(d*1000); 
      /*var i=s.getFullYear();
      var j=s.getMonth();
      var r=s.getDate();*/
      var sec=1000;
      var min=1000*60;
      var hour=1000*60*60;
      var days=1000*60*60*24;
      var last= this.fechaRed.getTime() - s.getTime();
      var trasSec=last/sec;
      var trasMin=last/min;
      var trasHour=last/hour;
      var trasDays=last/days;
      if(trasDays>1){ 
        var dias=Math.trunc(trasDays);
        var rdays="Se publico hace "+dias+" d";
        return rdays;
      }else if(trasHour>1){
       // console.log(trasHour);
        var horas=Math.trunc(trasHour);
        var rhoras="Se publico hace "+horas+" h";
        return rhoras;
      }else if(trasMin>1){
        var minutos=Math.trunc(trasMin);
        var rmin="Se publico hace "+minutos+" min";
        return rmin;
      }else if(trasSec>1){
        var segundos=Math.trunc(trasSec);
        var rsec="Se publico hace "+segundos+" sec";
        return rsec;
      }

      //return tras;
     
     // return p;
    }else{
      return '';
    }
   
 
  }

}
