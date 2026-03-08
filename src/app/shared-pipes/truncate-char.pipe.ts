import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'charTruncate'
})
export class CharTruncatePipe implements PipeTransform {
  transform(value: string, charLimit: number = 25, trail: string = '...'): string {
    if (!value) return '';

    return value.length > charLimit ? value.slice(0, charLimit) + trail : value;
  }
}
