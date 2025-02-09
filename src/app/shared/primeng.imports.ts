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
import { InputNumberModule } from 'primeng/inputnumber';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

export const PRIMENG_IMPORTS = [
  TableModule,
  InputTextModule,
  DividerModule,
  ProgressSpinnerModule,
  TooltipModule,
  PanelModule,
  InputMaskModule,
  AutoCompleteModule,
  InputNumberModule,
  DatePickerModule,
  InputGroupModule,
  InputGroupAddonModule,
  DropdownModule,
  IftaLabelModule,
  CalendarModule,
  ButtonModule,
  DialogModule,
  CardModule,
  ToastModule,
  InputIconModule,
  ConfirmDialogModule,
  ToolbarModule,
  IconFieldModule,
] as const;
