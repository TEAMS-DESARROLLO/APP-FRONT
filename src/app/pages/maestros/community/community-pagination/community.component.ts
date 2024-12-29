import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrudService } from '../../../../providers/crud.service';
import { Router, ActivatedRoute } from '@angular/router';

import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridOptions, IGetRowsParams, SelectionChangedEvent, GridReadyEvent, IDatasource } from 'ag-grid-community'


import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { ToolbarToolboxComponent } from "../../../shared/toolbar-toolbox/toolbar-toolbox.component";
import { PaginationService } from '../../../../providers/pagination.service';
import { ConvertFilterSortAgGridToStandartService } from '../../../../utils/ConvertFilterSortAgGridToStandart.service';
import { PaginationSortInterface } from '../../../../utils/interfaces/pagination.sort.interface';
import { MessagesService } from '../../../shared/messages/messages.service';

import { CommunityInterface } from './community.interface';

import { DatasourcePaginationInterface } from '../../../shared/interfaces/datasource-pagination-interface';
import { GridPaginationPrimengCustomComponent } from "../../../shared/grid-pagination-primeng-custom/grid-pagination-primeng-custom.component";
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-community',
  standalone: true,
  templateUrl: './community.component.html',
  styleUrl: './community.component.css',
  imports: [
    CommonModule,
    AgGridModule,
    ToolbarToolboxComponent,
    GridPaginationPrimengCustomComponent,
  ],
})
export default class CommunityComponent {
  title = 'COMUNIDADES';

  themeClass = 'ag-theme-quartz-dark';

    public rowSelectedFromGrid: any = null;

  private messagesService = inject(MessagesService);
  private crudService = inject(CrudService<CommunityInterface>);

  disabledEdit: boolean = false;
  disabledDelete: boolean = false;

  diabledSelect: boolean = false;
  flagReload: boolean = false;


  public controller: string = 'community';
  public event: string = 'pagination';
  public propertiesGrid: any = [
    {
      title: 'Codigos',
      propertyColumn: 'idPractice',
      style: { width: '150px' },
    },
    {
      title: 'Descripcion',
      propertyColumn: 'description',
      style: { flex: '1' },
    },
  ];

  constructor(private router: Router, private activeRouter: ActivatedRoute) {}

  NewRegistter() {
    this.router.navigate(['community-edit', '0'], {
      relativeTo: this.activeRouter.parent,
    });
  }
  edit() {

    const rowData = this.rowSelectedFromGrid;
    if (rowData == null) {
      return;
    }
    const id = rowData.idPractice;
    this.router.navigate(['community-edit', id], {
      relativeTo: this.activeRouter.parent,
    });
  }
  delete() {
    let rowData = this.rowSelectedFromGrid;
    if (rowData == null) {
      return;
    }
    let id = rowData.idPractice;

    this.messagesService
      .message_question(
        'warning',
        'Cuidado!',
        'Estas seguros de eliminar el registro ' + id,
        'Si, Estoy seguro',
        'No, cancelar'
      )
      .then((res) => {
        if (res) {
          this.crudService.deleteById('community', '', id).subscribe({
            next: (res) => {
              this.messagesService.message_ok(
                'procesado',
                'Registro Eliminado'
              );
              this.reload();
            },
            error: (error) => {
              this.messagesService.message_error('Atencion', error.message);
            },
          });
        }
      });
  }
  print() {}
  printExcel() {}
  reload() {

    this.flagReload = !this.flagReload;

  }


  onSelectionChanged(object: any) {

    if (object.selectedRow) {
      this.disabledEdit = true;
      this.disabledDelete = true;
      this.diabledSelect = true;
      this.rowSelectedFromGrid = object.data;
    } else {
      this.disabledEdit = false;
      this.disabledDelete = false;
      this.diabledSelect = false;
      this.rowSelectedFromGrid = null;
    }
  }
}
