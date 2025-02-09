import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { delay } from 'rxjs';
import { ItemNotaFiscal } from '../../model/item-nota-fiscal';
import { ItemNotaFiscalView } from '../../model/item-nota-fiscal-view';
import { NotaFiscal } from '../../model/nota-fiscal';
import { Produto } from '../../model/produto';
import { CnpjFormatPipe } from '../../shared/pipes/cnpj-format.pipe';
import { PRIMENG_IMPORTS } from '../../shared/primeng.imports';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { FornecedorService } from '../fornecedores/fornecedores.service';
import { ProdutoService } from '../produtos/produtos.service';
import { NotaService } from './nota.service';

@Component({
  selector: 'app-nota-fiscal',
  standalone: true,
  imports: [CnpjFormatPipe, ...SHARED_IMPORTS, ...PRIMENG_IMPORTS],
  providers: [MessageService, NotaService, ConfirmationService],
  templateUrl: './nota-fiscal.component.html',
  styleUrl: './nota-fiscal.component.scss',
})
export class NotaFiscalComponent {
  @ViewChild('dt3') dt3!: Table;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild('valorUnitarioInput') valorUnitarioInput: any;
  loading: boolean = false;
  editando: boolean = false;
  submitted: boolean = false;
  searchTerm: string = '';
  editandoItem: boolean = false;
  itemEmEdicao: ItemNotaFiscalView | null = null;
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
      id: [null],
      numero: [null, [Validators.required]],
      dataEmissao: ['', [Validators.required]],
      fornecedorId: [null, [Validators.required]],
      valorTotal: [null, [Validators.required]],
      itens: [null, [Validators.required]],
    });

    this.itemForm = this.fb.group({
      quantidade: [1, [Validators.required, Validators.min(1)]],
      valorUnitario: [0, [Validators.required, Validators.min(0.01)]],
    });
  }
  ngOnInit(): void {
    this.carregarNotas();
  }

  carregarNotas() {
    this.loading = true;
    // Delay apenas para simimular
    this.notaService
      .getNotas()
      .pipe(delay(200))
      .subscribe({
        next: (data) => {
          console.log(data);
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
    this.editando = false;
    this.fornecedorSelecionado = null;
    this.enderecoFornecedor = '';

    this.notaForm.reset({
      fornecedorId: null,
      itens: [],
    });

    this.itensNotaFiscal = [];
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

    const notaFiscal: NotaFiscal = {
      ...this.notaForm.value,
      fornecedorId: this.fornecedorSelecionado?.codigo,
    };

    if (notaFiscal.id) {
      this.notaService.updateNota(notaFiscal).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Nota atualizada com sucesso',
          });
          this.carregarNotas();
          this.ocultarModal();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Atenção',
            detail: err.error,
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
            detail: 'NF cadastrada com sucesso',
          });
          this.carregarNotas();
          this.ocultarModal();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Atenção',
            detail: err.error,
          });
        },
      });
    }
  }

  editarNotaFiscal(notaFiscal: NotaFiscal) {
    this.editando = true;
    this.notaDialog = true;

    this.notaForm.patchValue({
      id: notaFiscal.id,
      numero: notaFiscal.numero,
      dataEmissao: new Date(notaFiscal.dataEmissao),
      fornecedorId: notaFiscal.fornecedorId,
      valorTotal: notaFiscal.valorTotal,
      itens: notaFiscal.itens,
    });

    // Carregar fornecedor
    this.fornecedorService
      .getFornecedorById(notaFiscal.fornecedorId)
      .subscribe({
        next: (fornecedor) => {
          this.fornecedorSelecionado = fornecedor;
          this.fornecedorDisplay = fornecedor.razaoSocial;
        },
      });

    // Carregar itens
    this.itensNotaFiscal = notaFiscal.itens.map((item) => {
      // Carregar dados do produto para cada item
      this.produtoService.getProdutosById(item.produtoId).subscribe({
        next: (produto) => {
          item['produto'] = produto; // Adicionando produto para exibição na tabela
        },
      });
      return item;
    });
  }

  excluirNotaFiscal(nota: NotaFiscal) {
    this.confirmationService.confirm({
      message: `Deseja realmente excluir a nota ${nota.numero}?`,
      accept: () => {
        this.notaService.deleteNota(nota.numero).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Nota excluída com sucesso',
            });
            this.carregarNotas();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Atenção',
              detail: err.error,
            });
          },
        });
      },
    });
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
        this.messageService.add({
          severity: 'error',
          summary: 'Atenção',
          detail: err.error,
        });
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
      this.produtoDisplay = event.value.codigo + '-' + event.value.descricao;
    }
  }

  abrirModalItem() {
    if (!this.produtoSelecionado) return;

    this.itemDialog = true;
    this.itemForm.patchValue({
      valorUnitario: this.produtoSelecionado?.preco || 0,
      quantidade: 1,
    });

    // Usando um delay maior e detectando mudanças
    setTimeout(() => {
      if (this.valorUnitarioInput) {
        const inputElement = this.valorUnitarioInput.input?.nativeElement;
        if (inputElement) {
          inputElement.click();
          inputElement.focus();
          inputElement.select();
        }
      }
    }, 200);
  }

  fecharModalItem() {
    this.itemDialog = false;
    this.itemForm.reset();
    this.editandoItem = false;
    this.itemEmEdicao = null;
    this.produtoSelecionado = null;
    this.produtoDisplay = '';
  }

  calcularTotal() {
    const valorUnitario = this.itemForm.get('valorUnitario')?.value || 0;
    const quantidade = this.itemForm.get('quantidade')?.value || 0;
    const valorTotal = valorUnitario * quantidade;
    this.itemForm.patchValue({ valorTotal });
  }

  calcularTotalItem(): number {
    const quantidade = this.itemForm.get('quantidade')?.value || 0;
    const valorUnitario = this.itemForm.get('valorUnitario')?.value || 0;
    return quantidade * valorUnitario;
  }

  salvarItem() {
    if (this.itemForm.valid && this.produtoSelecionado) {
      const quantidade = this.itemForm.get('quantidade')?.value;
      const valorUnitario = this.itemForm.get('valorUnitario')?.value;
      const valorTotal = quantidade * valorUnitario;

      if (this.editandoItem && this.itemEmEdicao) {
        // Atualiza o item existente
        const index = this.itensNotaFiscal.findIndex(
          (item) => item === this.itemEmEdicao
        );
        if (index !== -1) {
          this.itensNotaFiscal[index] = {
            id: null,
            produtoId: this.produtoSelecionado.codigo,
            valorUnitario: valorUnitario,
            quantidade: quantidade,
            valorTotal: valorTotal,
            produto: this.produtoSelecionado, // mantemos para exibição na tabela
          };
        }
      } else {
        // Cria um novo item
        const novoItem: ItemNotaFiscalView = {
          id: null,
          produtoId: this.produtoSelecionado.codigo,
          valorUnitario: valorUnitario,
          quantidade: quantidade,
          valorTotal: valorTotal,
          produto: this.produtoSelecionado, // mantemos para exibição na tabela
        };
        this.itensNotaFiscal.push(novoItem);
      }

      // Atualiza o form da nota com os itens no formato correto
      const itensParaAPI = this.itensNotaFiscal.map((item) => ({
        id: item.id,
        produtoId: item.produtoId,
        valorUnitario: item.valorUnitario,
        quantidade: item.quantidade,
        valorTotal: item.valorTotal,
      }));

      this.notaForm.patchValue({
        itens: itensParaAPI,
      });

      this.atualizarValorTotal();
      this.fecharModalItem();
    }
  }

  editarItem(item: ItemNotaFiscalView) {
    this.editandoItem = true;
    this.itemEmEdicao = item;
    this.produtoSelecionado = item.produto;
    this.itemDialog = true;

    this.itemForm.patchValue({
      quantidade: item.quantidade,
      valorUnitario: item.valorUnitario,
    });
  }

  // Atualizar a assinatura do método para aceitar ItemNotaFiscalView
  removerItem(item: ItemNotaFiscalView) {
    this.confirmationService.confirm({
      message: 'Deseja realmente remover este item?',
      accept: () => {
        this.itensNotaFiscal = this.itensNotaFiscal.filter((i) => i !== item);

        this.notaForm.patchValue({
          itens: this.itensNotaFiscal,
        });
        this.atualizarValorTotal();
      },
    });
  }

  atualizarValorTotal() {
    const valorTotal = this.itensNotaFiscal.reduce(
      (total, item) => total + item.quantidade * item.valorUnitario,
      0
    );
    this.notaForm.patchValue({ valorTotal });
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.produtoSelecionado) {
      this.abrirModalItem();
    }
  }

  getTotalValorTotal(): number {
    return this.itensNotaFiscal.reduce(
      (total, nota) => total + nota.valorTotal,
      0
    );
  }
}
