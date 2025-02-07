import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Produto } from '../../model/produto';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.scss',
})
export class ProdutosComponent {
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
}
