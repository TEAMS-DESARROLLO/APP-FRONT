import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'shared-toolbar-toolbox',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './toolbar-toolbox.component.html',
  styleUrl: './toolbar-toolbox.component.css'
})
export class ToolbarToolboxComponent {

  @Input() _disabledEdit:boolean=false;
  @Input() _disabledDelete:boolean=false;
  @Input() _disabledChange:boolean=false;
  @Input() _disabledNew:boolean=false;


  @Input() _iconNew='playlist_add';
  @Input() _iconEdit='edit';
  @Input() _iconDelete='delete';
  @Input() _iconChange='change_circle';
  @Input() _iconPrint='print';
  @Input() _iconExport='import_export';
  @Input() _iconLoad='autorenew';

  @Input() _iconNewTooltip='Nuevo Registro';
  @Input() _iconEditToolTip='Editar Registro';
  @Input() _iconDeleteToolTip='Eliminar Registro';
  @Input() _iconChangeToolTip='Editar Estado';
  @Input() _iconPrintToolTip='Imprimir';
  @Input() _iconExportToolTip='Exportar Excel';
  @Input() _iconLoadToolTip='Re-Load';

  @Input() _iconNewShow:boolean=true;
  @Input() _iconEditShow:boolean=true;
  @Input() _iconDeleteShow:boolean=true;
  @Input() _iconChangeShow:boolean=true;
  @Input() _iconPrintShow:boolean=true;
  @Input() _iconExportShow:boolean=true;
  @Input() _iconLoadShow:boolean=true;



  @Output() _newRegistro:EventEmitter<any> = new EventEmitter();
  @Output() _editRegistro:EventEmitter<any> = new EventEmitter();
  @Output() _deleteRegistro:EventEmitter<any> = new EventEmitter();
  @Output() _changeStatus:EventEmitter<any> = new EventEmitter();
  @Output() _printPdf:EventEmitter<any> = new EventEmitter();
  @Output() _printExcel:EventEmitter<any> = new EventEmitter();
  @Output() _reLoad:EventEmitter<any> = new EventEmitter();


  constructor() { }

  newRegistro() {
    this._newRegistro.emit();
  }

  editRegistro(){
    this._editRegistro.emit();
  }

  deleteRegistro(){
    this._deleteRegistro.emit();
  }

  changeStatus(){ 
    this._changeStatus.emit();
  }

  printPdf(){
    this._printPdf.emit();

  }

  printExcel(){
    this._printExcel.emit();

  }

  reload(){
    this._reLoad.emit();

  }

}
