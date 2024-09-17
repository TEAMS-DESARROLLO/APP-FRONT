import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-button-edit-delete',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './button-edit-delete.component.html',
  styleUrl: './button-edit-delete.component.css',
})
export class ButtonEditDeleteComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;
  row!: any;
  show: boolean = false;

  constructor() {}

  agInit(props: ICellRendererParams<any, any, any>): void {

    this.params = props;
    this.row = props.data as any;

    if (this.row == undefined) {
      this.show = false;
      return;
    }
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return true;
  }

  delete() {

    this.params.context.componentParent.onCellClickedDelete(this.row);
  }
  edit() {

    this.params.context.componentParent.onCellClickedEdit(this.row);
  }
}
