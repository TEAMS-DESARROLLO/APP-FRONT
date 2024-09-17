import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { DataSoureDropDownComboInterface } from '../../interfaces/datasource-dropdown-interface';




@Component({
  selector: 'app-drop-down-shared',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, ReactiveFormsModule],
  templateUrl: './drop-down-shared.component.html',
  styleUrl: './drop-down-shared.component.css'
})



export class DropDownSharedComponent implements OnInit, OnChanges{

  @Input()
  _datosInput: DataSoureDropDownComboInterface[] = [
    {value: 'steak-0', viewValue: 'Steak'},
  ];

  @Input()
  _formControl = new FormControl;

  @Input()
  _captionLabel:string ="default"

  formControlDropDown = new FormControl('');


  ngOnInit(): void {


    if (this._formControl == undefined) {
      this._formControl = this.formControlDropDown;
    }
    let x = this._datosInput;

  }
  ngOnChanges(changes: SimpleChanges){

  }


  compareFn(c1:string, c2:string): boolean {


    return c1 && c2 ? c1 === c2 : c1 === c2;

  }


  _onSelectionChange(a:any) {

    //this._formControl.setValue(a);
  }





}
