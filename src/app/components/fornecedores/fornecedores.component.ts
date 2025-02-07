import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Fornecedor } from '../../model/fornecedor';

@Component({
  selector: 'app-fornecedores',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './fornecedores.component.html',
  styleUrl: './fornecedores.component.scss',
})
export class FornecedoresComponent implements OnInit {
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

  ngOnInit(): void {
  }
}
