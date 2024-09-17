import { Component, Input } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ButtonModule } from 'primeng/button';
import { RegisterPaginationInterface } from '../../../../register-pagination-interface';

@Component({
  selector: 'app-btn-show-details-course-follow',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './btn-show-details-course-follow.component.html',
  styleUrl: './btn-show-details-course-follow.component.css',
})
export class BtnShowDetailsCourseFollowComponent
  implements ICellRendererAngularComp
{
  @Input()
  _idAssignedCourseRegistration: number = 0;

  params!: ICellRendererParams;
  row!: RegisterPaginationInterface;
  show: boolean = false;

  agInit(props: ICellRendererParams<any, any, any>): void {
    this.params = props;
    this.row = props.data as RegisterPaginationInterface;

    if (this.row == undefined) {
      this.show = false;
      return;
    }
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return true;
  }
  clickButton() {
    this.params.context.componentParent.onCellClickedInformation(this.row);
  }
}
