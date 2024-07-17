import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';

import { PanelMenuModule } from 'primeng/panelmenu';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { NavigationEnd, Router } from '@angular/router';
import { delay, filter } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { MENU_DATA } from './menu-data';
import { NotificationsService } from '../shared/services/notifications.service';
import { NotificacionComponent } from "../shared/notificacion/notificacion.component";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ErrorInterface } from '../../utils/interfaces/errorInterface';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MenuItem } from 'primeng/api';
import { MENU_DATA_PRIME } from './menu-data-prime';




@UntilDestroy()
@Component({
    selector: 'app-menu',
    standalone: true,
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.css',
    imports: [CommonModule, RouterOutlet, RouterModule,CdkAccordionModule,
        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatListModule,
        MatTooltipModule,
        MatExpansionModule, NotificacionComponent, PanelMenuModule]
})
export default class MenuComponent {

  titulo = environment.nombreApp;

  public items = MENU_DATA.categorias;
  ruta = "/view1";
  itemsMenu: MenuItem[] | undefined;

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  panelOpenState: boolean=true;
  private notificacionesService = inject(NotificationsService);
  constructor(private observer: BreakpointObserver, private router: Router, private route:ActivatedRoute, private _snackBar: MatSnackBar){

  }

  ngOnInit(){
    this.notificacionesService.alert$.subscribe( (res:any)=> {

      let msg = res.msg;
      let httpStatus:number = res.httpStatus;
      let time:number = res.time;

      this._snackBar.open(msg, 'cerrar', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        panelClass: ['warning']

      });

      setTimeout(() => {
        this._snackBar.dismiss();
      }, res.time);
     });

     this.itemsMenu = MENU_DATA_PRIME;

  }


  ngAfterViewInit() {

    //this.sidenav.open();

    this.observer .observe(['(max-width: 800px)'])
    .pipe(delay(1), untilDestroyed(this))
    .subscribe((res) => {
      if (res.matches) {
        console.log("entrando ....")
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });

    this.router.events
    .pipe(
      untilDestroyed(this),
      filter((e) => e instanceof NavigationEnd)
      )
      .subscribe(() => {
        if (this.sidenav.mode === 'over') {
          this.sidenav.close();
        }
      });
    }


  boton() {

    //this.router.navigate (["/menu/demo"])
    this.router.navigate (["demo"], { relativeTo: this.route })
   }

   botonAlgo() {
     this.router.navigate (["/menu/algo"])
   }

   logaout(){
    this.router.navigate ([""])
   }


  }
