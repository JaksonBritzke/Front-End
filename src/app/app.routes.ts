import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'fornecedores',
    loadComponent: () =>
      import('./components/fornecedores/fornecedores.component').then(
        (m) => m.FornecedoresComponent
      ),
  },
  {
    path: 'produtos',
    loadComponent: () =>
      import('./components/produtos/produtos.component').then(
        (m) => m.ProdutosComponent
      ),
  },
  {
    path: 'nota-fiscal',
    loadComponent: () =>
      import('./components/nota-fiscal/nota-fiscal.component').then(
        (m) => m.NotaFiscalComponent
      ),
  },
];
