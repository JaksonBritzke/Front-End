import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { NotaFiscal } from '../../model/NotaFiscal';

@Component({
  selector: 'app-nota-fiscal',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './nota-fiscal.component.html',
  styleUrl: './nota-fiscal.component.scss'
})
export class NotaFiscalComponent {
  notasFiscais: NotaFiscal[] = [
    {
      numero: 'NF-001',
      data: new Date('2024-02-07'),
      fornecedor: 'Fornecedor A',
      valor: 1500.00,
      status: 'Emitida'
    },
    {
      numero: 'NF-002',
      data: new Date('2024-02-07'),
      fornecedor: 'Fornecedor B',
      valor: 2500.00,
      status: 'Pendente'
    }
  ];

  ngOnInit() {}
}
