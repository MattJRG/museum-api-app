import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  static truncate(value: string, maxCharacters: number): string {
    if (value) {
      const indexOfFirstSpaceAfterMaxCharacters = value.indexOf(' ', maxCharacters);
      return indexOfFirstSpaceAfterMaxCharacters === -1
        ? value
        : value.substring(0, indexOfFirstSpaceAfterMaxCharacters).concat('...');
    }

    return value;
  }

  transform(value: string, maxCharacters: number): string {
    return TruncatePipe.truncate(value, maxCharacters);
  }
}
