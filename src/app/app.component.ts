import { Component, HostBinding, OnInit } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay'
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

//import 'ag-grid-community/styles/ag-grid.css';
//import 'ag-grid-community/styles/ag-theme-quartz.css';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export default class AppComponent implements OnInit {
  title = 'appIsp';
  @HostBinding('class') componentCssClass:any

  constructor(public overlayContainer:OverlayContainer){ }


  ngOnInit(): void {

    this.onSetTheme('dark-theme');
  }



  public onSetTheme(e:string){
    console.log("THEMA DEFINIDO POR USUARIO " + e)
    this.overlayContainer.getContainerElement().classList.add(e);
    this.componentCssClass = e;
  }
}
