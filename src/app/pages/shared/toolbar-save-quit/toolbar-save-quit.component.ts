import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';


@Component({
  selector: 'shared-toolbar-save-quit',
  standalone: true,
  imports: [CommonModule,MatIconModule,MatButtonModule,MatTooltipModule],
  templateUrl: './toolbar-save-quit.component.html',
  styleUrl: './toolbar-save-quit.component.css'
})
export class ToolbarSaveQuitComponent {

  @Input() _flagCreate:boolean=false;

  @Input() _disabledSaveUpdate=true;

  @Output() _save:EventEmitter<any> = new EventEmitter();
  @Output() _update:EventEmitter<any> = new EventEmitter();
  @Output() _quit:EventEmitter<any> = new EventEmitter();


  constructor(

  ) { }



  save() {
    this._save.emit();
  }

  update() {
    this._update.emit();
  }

  quit(){
    this._quit.emit();
  }

}
