import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PanelModule } from 'primeng/panel';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Fornecedor } from '../../model/fornecedor';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@Component({
  selector: 'app-fornecedores',
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
  templateUrl: './fornecedores.component.html',
  styleUrl: './fornecedores.component.scss',
})
export class FornecedoresComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  @ViewChild('filter') filter!: ElementRef;
  searchTerm: string = '';
  fornecedores: Fornecedor[] = [
    {
      id: 1,
      nome: 'Fornecedor A',
      cnpj: '12.345.678/0001-90',
      telefone: '(11) 1234-5678',
      email: 'fornecedora@email.com',
    },
    {
      id: 2,
      nome: 'Fornecedor B',
      cnpj: '98.765.432/0001-10',
      telefone: '(11) 8765-4321',
      email: 'fornecedorb@email.com',
    },
  ];

  ngOnInit() {
  }


  editarFornecedor(fornecedor: Fornecedor) {
    console.log('Editar fornecedor', fornecedor);
  }

  excluirFornecedor(fornecedor: Fornecedor) {
    console.log('Excluir fornecedor', fornecedor);
  }

  abrirModalCadastro() {}
  onGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dt.filterGlobal(filterValue, 'contains');
  }

  clearSearch() {
    this.searchTerm = '';
    this.dt.filterGlobal(this.searchTerm, 'contains');
  }
}
