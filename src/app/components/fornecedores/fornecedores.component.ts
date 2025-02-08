import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
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
import { SituacaoFornecedor } from '../../model/enum/situacao-fornecedor';
import { Fornecedor } from '../../model/fornecedor';
import { CnpjFormatPipe } from '../../shared/pipes/cnpj-format.pipe';
import { FornecedorService } from './fornecedores.service';

@Component({
  selector: 'app-fornecedores',
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
    ToolbarModule,
    IconFieldModule,
    CnpjFormatPipe,
  ],
  providers: [MessageService, FornecedorService],
  templateUrl: './fornecedores.component.html',
  styleUrl: './fornecedores.component.scss',
})
export class FornecedoresComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  @ViewChild('filter') filter!: ElementRef;
  fornecedorDialog: boolean = false;
  searchTerm: string = '';
  fornecedores: Fornecedor[] = [];
  fornecedorForm: FormGroup;
  situacaoOptions = [
    { label: 'Ativo', value: SituacaoFornecedor.ATIVO },
    { label: 'Baixado', value: SituacaoFornecedor.BAIXADO },
    { label: 'Suspenso', value: SituacaoFornecedor.SUSPENSO },
  ];
  submitted: boolean = false;
  constructor(
    private fornecedorService: FornecedorService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.fornecedorForm = this.fb.group({
      codigo: [null],
      razaoSocial: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      endereco: ['', [Validators.required]],
      telefone: ['', [Validators.required]],
      cnpj: ['', [Validators.required]],
      situacao: [SituacaoFornecedor.ATIVO, [Validators.required]],
      dataBaixa: [null],
    });
  }
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
   // Clona o objeto para evitar referência direta
   const fornecedorEdit = { ...fornecedor };

   if (fornecedorEdit.dataBaixa) {
     fornecedorEdit.dataBaixa = new Date(fornecedorEdit.dataBaixa);
   }

   this.fornecedorForm.patchValue(fornecedorEdit);

   this.fornecedorDialog = true;
  }

  excluirFornecedor(fornecedor: Fornecedor) {
    console.log('Excluir fornecedor', fornecedor);
  }

  salvarFornecedor() {
    this.submitted = true;

    if (this.fornecedorForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos obrigatórios corretamente',
      });
      return;
    }

    const fornecedor: Fornecedor = { ...this.fornecedorForm.value };

    // Remove as máscaras
    fornecedor.cnpj = this.removeMask(fornecedor.cnpj);
    fornecedor.telefone = this.removeMask(fornecedor.telefone);

    if (
      fornecedor.situacao === SituacaoFornecedor.BAIXADO &&
      !fornecedor.dataBaixa
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Data de Baixa é obrigatória quando a situação é Baixado',
      });
      return;
    }

    if (fornecedor.codigo) {
      // Atualização - Note o uso do codigo como primeiro parâmetro
      this.fornecedorService
        .updateFornecedor(fornecedor.codigo, fornecedor)
        .subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Fornecedor atualizado com sucesso',
            });
            this.carregarFornecedores();
            this.ocultarModal();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao atualizar fornecedor',
            });
          },
        });
    } else {
      // Novo cadastro
      this.fornecedorService.createFornecedor(fornecedor).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Fornecedor cadastrado com sucesso',
          });
          this.carregarFornecedores();
          this.ocultarModal();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao cadastrar fornecedor',
          });
        },
      });
    }
  }

  ocultarModal() {
    this.fornecedorDialog = false;
    this.submitted = false;
    this.fornecedorForm.reset();
    this.fornecedorForm.patchValue({ situacao: SituacaoFornecedor.ATIVO });
  }

  abrirModalCadastro() {
    this.fornecedorForm.reset();
    this.fornecedorForm.patchValue({ situacao: SituacaoFornecedor.ATIVO });
    this.submitted = false;
    this.fornecedorDialog = true;
  }
  onGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dt.filterGlobal(filterValue, 'contains');
  }

  clearSearch() {
    this.searchTerm = '';
    this.dt.filterGlobal(this.searchTerm, 'contains');
  }

  private removeMask(value: string): string {
    return value.replace(/[^0-9]/g, '');
  }
}
