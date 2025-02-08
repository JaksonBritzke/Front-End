import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
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
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { delay } from 'rxjs';
import { ItemNotaFiscal } from '../../model/ItemNotaFiscal';
import { NotaFiscal } from '../../model/NotaFiscal';
import { Produto } from '../../model/produto';
import { CnpjFormatPipe } from '../../shared/pipes/cnpj-format.pipe';
import { FornecedorService } from '../fornecedores/fornecedores.service';
import { ProdutoService } from '../produtos/produtos.service';
import { NotaService } from './nota.service';

@Component({
  selector: 'app-nota-fiscal',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    InputTextModule,
    ProgressSpinnerModule,
    DividerModule,
    FormsModule,
    PanelModule,
    InputMaskModule,
    CnpjFormatPipe,
    DatePickerModule,
    InputTextModule,
    AutoCompleteModule,
    InputGroupModule,
    InputGroupAddonModule,
    ReactiveFormsModule,
    DropdownModule,
    IftaLabelModule,
    CalendarModule,
    FormsModule,
    ButtonModule,
    InputNumberModule,
    DialogModule,
    ToolbarModule,
    CardModule,
    ToastModule,
    InputIconModule,
    ConfirmDialogModule,
    ToolbarModule,
    IconFieldModule,
  ],
  providers: [MessageService, NotaService, ConfirmationService],
  templateUrl: './nota-fiscal.component.html',
  styleUrl: './nota-fiscal.component.scss',
})
export class NotaFiscalComponent {
  @ViewChild('dt3') dt3!: Table;
  @ViewChild('filter') filter!: ElementRef;
  loading: boolean = false;
  submitted: boolean = false;
  searchTerm: string = '';
  notaForm: FormGroup;
  notaFiscal: NotaFiscal[] = [];
  produtos: Produto[] = [];
  notaDialog: boolean = false;
  fornecedoresFiltrados: any[] = [];
  fornecedorDisplay: string = '';
  produtosFiltrados: any[] = [];
  enderecoFornecedor: string = '';
  produtosSelecionados: any[] = [];
  fornecedorSelecionado: any = null;
  produtoSelecionado: any;
  itemDialog: boolean = false;
  itemForm: FormGroup;
  itensNotaFiscal: ItemNotaFiscal[] = [];
  editandoItem: boolean = false;
  itemEmEdicao: ItemNotaFiscal | null = null;
  produtoDisplay: any;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private notaService: NotaService,
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private fornecedorService: FornecedorService
  ) {
    this.notaForm = this.fb.group({
      numero: [null, [Validators.required]],
      dataEmissao: ['', [Validators.required]],
      fornecedorId: [null, [Validators.required]],
      valorTotal: [null, [Validators.required]],
      itens: [null, [Validators.required]],
    });

    this.itemForm = this.fb.group({
      valorUnitario: [null, [Validators.required, Validators.min(0.01)]],
      quantidade: [1, [Validators.required, Validators.min(1)]],
      valorTotal: [{ value: null, disabled: true }],
    });
  }
  ngOnInit(): void {
    this.carregarNotas();
  }

  carregarNotas() {
    this.loading = true;
    // Simulando um delay para verificar o loading
    this.notaService
      .getNotas()
      .pipe(delay(500))
      .subscribe({
        next: (data) => {
          this.notaFiscal = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar notas', err);
          this.loading = false;
        },
      });
  }

  filtrarFornecedor(event: any) {
    const query = event.query;
    if (!query) {
      this.fornecedorService.getFornecedores().subscribe({
        next: (fornecedores) => {
          this.fornecedoresFiltrados = fornecedores;
        },
        error: (error) => {
          console.error('Erro ao buscar fornecedores:', error);
          this.fornecedoresFiltrados = [];
        },
      });
    } else {
      this.fornecedorService.getFornecedoresByRazaoSocial(query).subscribe({
        next: (fornecedores) => {
          this.fornecedoresFiltrados = Array.isArray(fornecedores)
            ? fornecedores
            : [fornecedores];
        },
        error: (error) => {
          console.error('Erro ao buscar fornecedores:', error);
          this.fornecedoresFiltrados = [];
        },
      });
    }
  }

  filtrarProdutos(event: any) {
    const query = event.query;

    if (!query) {
      this.produtoService.getProdutos().subscribe({
        next: (produtos) => {
          this.produtosFiltrados = produtos;
        },
        error: (error) => {
          console.error('Erro ao buscar produtos:', error);
          this.produtosFiltrados = [];
        },
      });
    } else {
      this.produtoService.buscarPorDescricao(query).subscribe({
        next: (produtos) => {
          this.produtosFiltrados = produtos;
        },
        error: (error) => {
          console.error('Erro ao buscar produtos:', error);
          this.produtosFiltrados = [];
        },
      });
    }
  }

  limparProduto() {
    this.produtoSelecionado = null;
    this.produtoDisplay = '';
    this.notaForm.patchValue({
      produtoId: null,
    });
  }

  adicionarProduto() {
    const produto = this.notaForm.get('produtoTemp')?.value;
    if (produto) {
      const produtoComQuantidade = {
        ...produto,
        quantidade: 1,
      };
      this.produtosSelecionados.push(produtoComQuantidade);
      this.notaForm.get('produtoTemp')?.reset();
    }
  }

  onFornecedorSelect(event: any) {
    if (event && event.value) {
      this.fornecedorSelecionado = event.value;

      // Atualiza o display com a razão social
      this.fornecedorDisplay = event.value.razaoSocial;

      // Atualiza o form com o código
      this.notaForm.patchValue({
        fornecedorId: event.value.codigo,
      });

      if (event.value.situacao === 'SUSPENSO') {
        this.messageService.add({
          severity: 'warn',
          summary: 'Atenção',
          detail: 'Este fornecedor está suspenso no sistema.',
        });
        this.limparFornecedor();
        return;
      }

      this.notaForm.get('fornecedorId')?.updateValueAndValidity();
    }
  }

  isFornecedorSelecionado(): boolean {
    return this.fornecedorSelecionado !== null;
  }

  removerProduto(produto: any) {
    const index = this.produtosSelecionados.indexOf(produto);
    if (index > -1) {
      this.produtosSelecionados.splice(index, 1);
    }
  }

  ocultarModal() {
    this.notaDialog = false;
    this.submitted = false;
    this.fornecedorSelecionado = null;
    this.enderecoFornecedor = '';
    this.notaForm.reset();
    this.produtosSelecionados = [];
  }

  salvarNota() {
    this.submitted = true;

    if (this.notaForm.valid && this.produtosSelecionados.length > 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos obrigatórios',
      });
      return;
    }

    const notaFiscal: NotaFiscal = { ...this.notaForm.value };

    if (notaFiscal.id) {
      this.notaService.updateNota(notaFiscal).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Produto atualizado com sucesso',
          });
          this.carregarNotas();
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
      this.notaService.createNota(notaFiscal).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Produto cadastrado com sucesso',
          });
          this.carregarNotas();
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

  editarNotaFiscal(notaFiscal: NotaFiscal) {
    console.log('Editar notaFiscal', notaFiscal);
  }

  excluirNotaFiscal(notaFiscal: NotaFiscal) {
    console.log('Excluir notaFiscal', notaFiscal);
  }

  abrirModalCadastro() {
    this.notaForm.reset();
    this.submitted = false;
    this.notaDialog = true;
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

  adicionar(produto: any) {}

  limparFornecedor() {
    this.fornecedorSelecionado = null;
    this.fornecedorDisplay = '';
    this.notaForm.patchValue({
      fornecedorId: null,
    });
  }

  onGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dt3.filterGlobal(filterValue, 'contains');
  }

  clearSearch() {
    this.searchTerm = '';
    this.dt3.filterGlobal(this.searchTerm, 'contains');
  }

  onProdutoSelect(event: any) {
    if (event && event.value) {
      this.produtoSelecionado = event.value;
      this.produtoDisplay = event.value.descricao;
    }
  }

  abrirModalItem() {
    this.itemDialog = true;
    this.editandoItem = false;
    this.itemForm.reset();
    this.itemForm.patchValue({
      valorUnitario: this.produtoSelecionado?.preco || 0,
      quantidade: 1,
    });
    this.calcularTotal();
  }

  fecharModalItem() {
    this.itemDialog = false;
    this.itemForm.reset();
    this.itemEmEdicao = null;
  }

  calcularTotal() {
    const valorUnitario = this.itemForm.get('valorUnitario')?.value || 0;
    const quantidade = this.itemForm.get('quantidade')?.value || 0;
    const valorTotal = valorUnitario * quantidade;
    this.itemForm.patchValue({ valorTotal });
  }

  salvarItem() {
    if (this.itemForm.valid && this.produtoSelecionado) {
      const novoItem: ItemNotaFiscal = {
        id: this.itemEmEdicao?.id || 0,
        produtoId: this.produtoSelecionado.codigo,
        valorUnitario: this.itemForm.get('valorUnitario')?.value,
        quantidade: this.itemForm.get('quantidade')?.value,
        valorTotal: this.itemForm.get('valorTotal')?.value,
        produto: this.produtoSelecionado, // para exibição na tabela
      };

      if (this.editandoItem && this.itemEmEdicao) {
        // Atualiza item existente
        const index = this.itensNotaFiscal.findIndex(
          (item) => item.id === this.itemEmEdicao?.id
        );
        if (index !== -1) {
          this.itensNotaFiscal[index] = novoItem;
        }
      } else {
        // Adiciona novo item
        this.itensNotaFiscal.push(novoItem);
      }

      this.atualizarValorTotal();
      this.fecharModalItem();
      this.produtoSelecionado = null;
      this.produtoDisplay = '';
    }
  }

  editarItem(item: ItemNotaFiscal) {
    this.itemEmEdicao = item;
    this.editandoItem = true;
    this.produtoSelecionado = item.produtoId;

    this.itemForm.patchValue({
      valorUnitario: item.valorUnitario,
      quantidade: item.quantidade,
      valorTotal: item.valorTotal,
    });

    this.itemDialog = true;
  }

  removerItem(item: ItemNotaFiscal) {
    this.confirmationService.confirm({
      message: 'Deseja realmente remover este item?',
      accept: () => {
        this.itensNotaFiscal = this.itensNotaFiscal.filter((i) => i !== item);
        this.atualizarValorTotal();
      },
    });
  }

  atualizarValorTotal() {
    const valorTotal = this.itensNotaFiscal.reduce(
      (total, item) => total + item.valorTotal,
      0
    );
    this.notaForm.patchValue({ valorTotal });
  }
}
