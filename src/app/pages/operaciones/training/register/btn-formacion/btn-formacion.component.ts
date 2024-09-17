import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ButtonModule } from 'primeng/button';
import { RegisterPaginationInterface } from '../../register-pagination-interface';

@Component({
  selector: 'app-btn-formacion',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './btn-formacion.component.html',
  styleUrl: './btn-formacion.component.css',
})
export class BtnFormacionComponent implements ICellRendererAngularComp {
  @Input()
  _idCollaborator: number = 0;

  params!: ICellRendererParams;
  row!: RegisterPaginationInterface;
  show: boolean = false;

  @Output() _clickButton: EventEmitter<any> = new EventEmitter();

  agInit(props: ICellRendererParams): void {
    this.params = props;
    this.row = props.data as RegisterPaginationInterface;

    if (this.row == undefined) {
      this.show = false;
      return;
    }
    // if (this.row.operacionTipo.operIdtope == 4) {
    //   this.color = 'warn';
    // } else {
    //   this.color = 'primary';
    // }
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {

    return true;
  }

  clickButton() {

    this.params.context.componentParent.onCellClicked(this.row);
  }
}
