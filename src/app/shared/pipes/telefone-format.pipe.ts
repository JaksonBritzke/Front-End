import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telefone',
  standalone: true
})
export class TelefonePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    // Remove todos os caracteres não numéricos
    const numero = value.replace(/\D/g, '');

    // Verifica se é celular (9 dígitos) ou fixo (8 dígitos)
    if (numero.length === 11) {
      return `${numero.slice(0, 2)} ${numero.slice(2, 7)}-${numero.slice(7)}`;
    } else if (numero.length === 10) {
      return `${numero.slice(0, 2)} ${numero.slice(2, 6)}-${numero.slice(6)}`;
    }

    return value; // Retorna o valor original se não corresponder aos padrões
  }
}
