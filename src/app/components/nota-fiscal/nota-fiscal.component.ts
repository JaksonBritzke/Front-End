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
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { AutoCompleteModule } from 'primeng/autocomplete';
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
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { delay } from 'rxjs';
import { NotaFiscal } from '../../model/NotaFiscal';
import { NotaService } from './nota.service';
import { InputNumberModule } from 'primeng/inputnumber';

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
  notaDialog: boolean = false;
  fornecedoresFiltrados: any[] = [];
  produtosFiltrados: any[] = [];
  enderecoFornecedor: string = '';
  produtosSelecionados: any[] = [];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private notaService: NotaService,
    private fb: FormBuilder
  ) {
    this.notaForm = this.fb.group({
      numero: [null],
      dataEmissao: ['', [Validators.required]],
      fornecedorId: [null, [Validators.required]],
      valorTotal: [null, [Validators.required]],
      itens: [null, [Validators.required]],
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
      .pipe(delay(1000))
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
    // Implemente a lógica de filtro de fornecedores
    const query = event.query;
    // Exemplo: this.fornecedoresFiltrados = await this.service.buscarFornecedores(query);
  }

  filtrarProdutos(event: any) {
    // Implemente a lógica de filtro de produtos
    const query = event.query;
    // Exemplo: this.produtosFiltrados = await this.service.buscarProdutos(query);
  }

  adicionarProduto() {
    const produto = this.notaForm.get('produtoTemp')?.value;
    if (produto) {
      const produtoComQuantidade = {
        ...produto,
        quantidade: 1
      };
      this.produtosSelecionados.push(produtoComQuantidade);
      this.notaForm.get('produtoTemp')?.reset();
    }
  }

  onFornecedorSelect(event: any) {
    this.enderecoFornecedor = `${event.endereco}, ${event.numero} - ${event.cidade}/${event.uf}`;
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
  onGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dt3.filterGlobal(filterValue, 'contains');
  }

  clearSearch() {
    this.searchTerm = '';
    this.dt3.filterGlobal(this.searchTerm, 'contains');
  }
}
