import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { isNullOrUndefined } from 'util';
@Injectable({
  providedIn: 'root'
})
export class ValidadoresService {

  constructor() { }
  fechaMayor2(date1:string, date2:string){
    return (formGroup:FormGroup)=>{
      const date1C=formGroup.controls[date1];
      const date2C=formGroup.controls[date2];
     
      if(isNullOrUndefined(date2C.value) ){
        date2C.setErrors(null);
      }else{
        if(date1C.value <=date2C.value){
          date2C.setErrors(null);
       }else {
        date2C.setErrors({mayor:true});
       }
      }
    
    }
  }  
}
