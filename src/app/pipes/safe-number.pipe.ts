import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'safeNumber'
})
export class SafeNumberPipe implements PipeTransform {

  transform(value: Number): string {
    if (Number.isNaN(value)) {
      return "?"
    }
    return value.toString();
  }
}
