import {  Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name:'formatPhone'
  })
  
  export class formatPhone implements PipeTransform{
    transform(value:string): string{
        console.log(value);
        /*if(value.length>3)
        {
            console.log('aki');
            return value.slice(0,2);
        }
        else
            return value;*/
        /*let cont = 0;
        let result = '';*/
        if(value.length==8)
        {
            return value.slice(0,2)+'-'+value.slice(2,4)+'-'+value.slice(4,6)+'-'+value.slice(6,8);
        }
        return value;
        
    }
  }