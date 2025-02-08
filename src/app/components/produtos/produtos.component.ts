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
import { Produto } from '../../model/produto';

@Component({
  selector: 'app-produtos',
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
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.scss',
})
export class ProdutosComponent {
  @ViewChild('dt2') dt2!: Table;
  @ViewChild('filter') filter!: ElementRef;
  searchTerm: string = '';
  produtos: Produto[] = [
    {
      id: 1,
      nome: 'Produto A',
      categoria: 'Categoria 1',
      preco: 99.9,
      estoque: 100,
    },
    {
      id: 2,
      nome: 'Produto B',
      categoria: 'Categoria 2',
      preco: 149.9,
      estoque: 50,
    },
  ];

  ngOnInit() {}

  editarProduto(produto: Produto) {
    console.log('Editar fornecedor', produto);
  }

  excluirProduto(produto: Produto) {
    console.log('Excluir fornecedor', produto);
  }

  abrirModalCadastro() {}
  onGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dt2.filterGlobal(filterValue, 'contains');
  }

  clearSearch() {
    this.searchTerm = '';
    this.dt2.filterGlobal(this.searchTerm, 'contains');
  }
}
