import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { PanelModule } from 'primeng/panel';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { NotaFiscal } from '../../model/NotaFiscal';

@Component({
  selector: 'app-nota-fiscal',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    FormsModule,
    PanelModule,
    InputGroupModule,
    InputGroupAddonModule,
    ButtonModule,
    CardModule,
    ToastModule,
    InputIconModule,
    ToolbarModule,
    IconFieldModule,
  ],
  providers: [MessageService],
  templateUrl: './nota-fiscal.component.html',
  styleUrl: './nota-fiscal.component.scss',
})
export class NotaFiscalComponent {
  @ViewChild('dt3') dt3!: Table;
  @ViewChild('filter') filter!: ElementRef;
  searchTerm: string = '';
  notasFiscais: NotaFiscal[] = [
    {
      numero: 'NF-001',
      data: new Date('2024-02-07'),
      fornecedor: 'Fornecedor A',
      valor: 1500.0,
      status: 'Emitida',
    },
    {
      numero: 'NF-002',
      data: new Date('2024-02-07'),
      fornecedor: 'Fornecedor B',
      valor: 2500.0,
      status: 'Pendente',
    },
  ];

  ngOnInit() {}

  editarNotaFiscal(notaFiscal: NotaFiscal) {
    console.log('Editar notaFiscal', notaFiscal);
  }

  excluirNotaFiscal(notaFiscal: NotaFiscal) {
    console.log('Excluir notaFiscal', notaFiscal);
  }

  abrirModalCadastro() {}
  onGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dt3.filterGlobal(filterValue, 'contains');
  }

  clearSearch() {
    this.searchTerm = '';
    this.dt3.filterGlobal(this.searchTerm, 'contains');
  }
}
