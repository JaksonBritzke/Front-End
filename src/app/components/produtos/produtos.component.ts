import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { SituacaoProduto } from '../../model/enum/situacao-produto.';
import { Produto } from '../../model/produto';
import { CnpjFormatPipe } from '../../shared/pipes/cnpj-format.pipe';
import { ProdutoService } from './produtos.service';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    InputTextModule,
    DividerModule,
    FormsModule,
    PanelModule,
    InputMaskModule,
    DatePickerModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    ReactiveFormsModule,
    DropdownModule,
    IftaLabelModule,
    CalendarModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    ToolbarModule,
    CardModule,
    ToastModule,
    InputIconModule,
    ConfirmDialogModule,
    ToolbarModule,
    IconFieldModule,
    CnpjFormatPipe,
  ],
  providers: [MessageService, ProdutoService, ConfirmationService],
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.scss',
})
export class ProdutosComponent implements OnInit {
  @ViewChild('dt2') dt2!: Table;
  @ViewChild('filter') filter!: ElementRef;
  produtoDialog: boolean = false;
  searchTerm: string = '';
  produtos: Produto[] = [];
  produtoForm: FormGroup;
  situacaoOptions = [
    { label: 'Ativo', value: SituacaoProduto.ATIVO },
    { label: 'Inativo', value: SituacaoProduto.INATIVO },
  ];
  submitted: boolean = false;
  constructor(
    private produtoService: ProdutoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {
    this.produtoForm = this.fb.group({
      codigo: [null],
      descricao: ['', [Validators.required]],
      situacao: [SituacaoProduto.ATIVO, [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.produtoService.getProdutos().subscribe({
      next: (data) => {
        this.produtos = data;
      },
      error: (err) => {
        console.error('Erro ao carregar produtos', err);
      },
    });
  }

  editarProduto(produto: Produto) {
    // Clona o objeto para evitar referência direta
    const produtoEdit = { ...produto };
    this.produtoForm.patchValue(produtoEdit);
    this.produtoDialog = true;
  }

  excluirProduto(produto: Produto) {
    this.confirmationService.confirm({
      message: `Deseja realmente excluir o produto ${produto.descricao}?`,
      accept: () => {
        this.produtoService.deleteProduto(produto.codigo).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto excluído com sucesso',
            });
            this.carregarProdutos();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Atenção', detail: err.error });
          },
        });
      },
    });
  }

  salvarProduto() {
    this.submitted = true;

    if (this.produtoForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos obrigatórios',
      });
      return;
    }

    const produto: Produto = { ...this.produtoForm.value };

    if (produto.codigo) {
      // Atualização - Note o uso do codigo como primeiro parâmetro
      this.produtoService.updateProduto(produto.codigo, produto).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Produto atualizado com sucesso',
          });
          this.carregarProdutos();
          this.ocultarModal();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao atualizar produto',
          });
        },
      });
    } else {
      // Novo cadastro
      this.produtoService.createProduto(produto).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Produto cadastrado com sucesso',
          });
          this.carregarProdutos();
          this.ocultarModal();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao cadastrar produto',
          });
        },
      });
    }
  }

  ocultarModal() {
    this.produtoDialog = false;
    this.submitted = false;
    this.produtoForm.reset();
    this.produtoForm.patchValue({ situacao: SituacaoProduto.ATIVO });
  }

  abrirModalCadastro() {
    this.produtoForm.reset();
    this.produtoForm.patchValue({ situacao: SituacaoProduto.ATIVO });
    this.submitted = false;
    this.produtoDialog = true;
  }
  onGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dt2.filterGlobal(filterValue, 'contains');
  }

  clearSearch() {
    this.searchTerm = '';
    this.dt2.filterGlobal(this.searchTerm, 'contains');
  }
}
