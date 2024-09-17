import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-toolbar-select-cancel',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './toolbar-select-cancel.component.html',
  styleUrl: './toolbar-select-cancel.component.css',
})
export class ToolbarSelectCancelComponent {
  @Output() _select: EventEmitter<any> = new EventEmitter();
  @Output() _quit: EventEmitter<any> = new EventEmitter();

  @Input() _disabledSelect: boolean = false;

  select() {
    this._select.emit();
  }

  quit() {
    this._quit.emit();
  }
}
