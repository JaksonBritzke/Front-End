import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FornecedoresComponent } from './components/fornecedores/fornecedores.component';
import { ProdutosComponent } from './components/produtos/produtos.component';
import { NotaFiscalComponent } from './components/nota-fiscal/nota-fiscal.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'fornecedores', component: FornecedoresComponent },
  { path: 'produtos', component: ProdutosComponent },
  { path: 'nota-fiscal', component: NotaFiscalComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
