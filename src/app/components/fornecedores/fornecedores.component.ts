import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { Fornecedor } from '../../model/fornecedor';
import { FornecedorService } from './fornecedores.service';
import { CnpjFormatPipe } from '../../shared/pipes/cnpj-format.pipe';

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
    CnpjFormatPipe
  ],
  providers: [MessageService, FornecedorService],
  templateUrl: './fornecedores.component.html',
  styleUrl: './fornecedores.component.scss',
})
export class FornecedoresComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  @ViewChild('filter') filter!: ElementRef;
  searchTerm: string = '';
  fornecedores: Fornecedor[] = [];

  constructor(private fornecedorService: FornecedorService) {}

  ngOnInit(): void {
    this.carregarFornecedores();
  }

  carregarFornecedores(): void {
    this.fornecedorService.getFornecedores().subscribe({
      next: (data) => {
        this.fornecedores = data;
      },
      error: (err) => {
        console.error('Erro ao carregar fornecedores', err);
      },
    });
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
