import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DataSoureDropDownComboInterface } from '../../interfaces/datasource-dropdown-interface';

@Component({
  selector: 'app-drop-down-shared-multiple',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: './drop-down-shared-multiple.component.html',
  styleUrl: './drop-down-shared-multiple.component.css'
})
export class DropDownSharedMultipleComponent implements OnInit, OnChanges {
  
  
  @Input()
  _datosInput: DataSoureDropDownComboInterface[] = [
    {value: 'steak-0', viewValue: 'Steak'},
  ];

  @Input()
  _formControl = new FormControl;

  formControlDropDown = new FormControl('');

  ngOnInit(): void {


    if (this._formControl == undefined) {
      this._formControl = this.formControlDropDown;
    }
    let x = this._datosInput;

  }

  compareFn(c1:string, c2:string): boolean {


    return c1 && c2 ? c1 === c2 : c1 === c2;

  }

  ngOnChanges(changes: SimpleChanges): void {
    
  }

  _onSelectionChange(a:any) {

    //this._formControl.setValue(a);
  }

}
