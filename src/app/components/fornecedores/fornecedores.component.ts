import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { SituacaoFornecedor } from '../../model/enum/situacao-fornecedor';
import { Fornecedor } from '../../model/fornecedor';
import { CnpjFormatPipe } from '../../shared/pipes/cnpj-format.pipe';
import { PRIMENG_IMPORTS } from '../../shared/primeng.imports';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { FornecedorService } from './fornecedores.service';
import { TelefonePipe } from '../../shared/pipes/telefone-format-pipe';
import { delay } from 'rxjs';

@Component({
  selector: 'app-fornecedores',
  standalone: true,
  imports: [...SHARED_IMPORTS, ...PRIMENG_IMPORTS, CnpjFormatPipe, TelefonePipe],
  providers: [MessageService, FornecedorService, ConfirmationService],
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
  loading = false;
  constructor(
    private fornecedorService: FornecedorService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
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
    this.loading = true;
    // Delay apenas para simimular
    this.fornecedorService.getFornecedores().pipe(delay(200)).subscribe({
      next: (data) => {
        this.fornecedores = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'warn',
          summary: 'Ops',
          detail: 'Tente novamente mais tarde.',
        });
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
    this.confirmationService.confirm({
      message: `Deseja realmente excluir o fornecedor ${fornecedor.razaoSocial}?`,
      accept: () => {
        this.fornecedorService.deleteFornecedor(fornecedor.codigo).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Fornecedor excluído com sucesso',
            });
            this.carregarFornecedores();
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
      this.fornecedorService
        .updateFornecedor(fornecedor)
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
