import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { Menubar } from 'primeng/menubar';
import { Ripple } from 'primeng/ripple';

@Component({
  selector: 'app-root',
  imports: [
    Menubar,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    CommonModule,
  ],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        styleClass: 'custom-menu-item',
      },
      {
        label: 'Cadastros',
        icon: PrimeIcons.PLUS,
        styleClass: 'custom-menu-item',
        items: [
          {
            label: 'Fornecedores',
            icon: PrimeIcons.USERS,
            styleClass: 'custom-menu-item',
          },
          {
            separator: true,
          },
          {
            label: 'Produtos',
            icon: PrimeIcons.OBJECTS_COLUMN,
            styleClass: 'custom-menu-item',
          },
        ],
      },
      {
        label: 'Nota Fiscal',
        icon: PrimeIcons.BOOK,
        styleClass: 'custom-menu-item',
      },
    ];

  }
}
