import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appToUpperCase]',
  standalone: true,
})
export class ToUpperCaseDirective {

  @HostListener('input', ['$event']) onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
  }

}
