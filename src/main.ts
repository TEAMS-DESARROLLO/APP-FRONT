import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import AppComponent from './app/app.component';

 //import 'ag-grid-community/styles/ag-grid.css';
 //import 'ag-grid-community/styles/ag-theme-quartz.css';
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
