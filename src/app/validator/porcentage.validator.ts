import {AbstractControl} from '@angular/forms';

export function ValidatePorcentage(control: AbstractControl)
{
    //let integer = split
    let array: string[] = control.value.split('.');
	
	return true;

    /*if(array[0].length()>2 || array[1].length()>2)
		return true;
	else
		return null;*/
    

}