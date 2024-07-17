import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-toolbar-title',
  standalone: true,
  imports: [CommonModule,MatCardModule],
  templateUrl: './toolbar-title.component.html',
  styleUrl: './toolbar-title.component.css'
})
export class ToolbarTitleComponent {

}
