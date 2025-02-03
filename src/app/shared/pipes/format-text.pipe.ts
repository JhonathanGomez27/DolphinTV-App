import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatText',
  standalone: true
})
export class FormatTextPipe implements PipeTransform {

  //replace given caracter with another caracter
    transform(value: string, char: string, replace: string): string {
        console.log(value, char, replace);
        return value.replaceAll(char, replace);
    }

}
