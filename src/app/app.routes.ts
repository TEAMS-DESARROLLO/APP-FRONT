import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import DemoComponent from './pages/demo/demo.component';
import { exitGuard } from './guards/exit.guard';
export const routes: Routes = [
  {
    path: 'app',
    loadComponent: () => import('./app.component'),

    children:[
      {
        path : 'login',
        title : 'sistema',
        loadComponent: () => import('./pages/login/login.component')
      },
      {
        path: 'menu',
        loadComponent: () => import('./pages/menu/menu.component'),
        children : [
          {
            path : 'demo',
            loadComponent : () => import('./pages/demo/demo.component'),

          },

          //Operaciones
          {
            path : 'training-register-collaborator',
            title: 'Registro',
            loadComponent : () => import('./pages/operaciones/training/register/register.component'),
          },
          {
            path : 'tipo-documento-identidad-edit/:idTipoDocumentoIdentidad',
            title: 'tipo doc iden',
            loadComponent : () => import('./pages/maestros/tipo-documento-identidad/tipo-documento-identidad-edit/tipo-documento-identidad-edit.component')
          },

          {
            path : 'tipo-via',
            title: 'tipo via',
            loadComponent : () => import('./pages/maestros/tipo-via/tipo-via-pagination/tipo-via.component'),
          },
          {
            path : 'tipo-via-edit/:id',
            title: 'tipo via edit',
            loadComponent : () => import('./pages/maestros/tipo-via/tipo-via-edit/tipo-via-edit.component'),
            canDeactivate : [exitGuard]
          },
          {
            path : 'cliente',
            title: 'Clientes',
            loadComponent : () => import('./pages/cliente/cliente-pagination/cliente-pagination.component'),

          },
          {
            path : 'cliente-edit/:id',
            title: 'Cliente edit',
            loadComponent : () => import('./pages/cliente/cliente-edit/cliente-edit.component'),
            canDeactivate : [exitGuard]
          },

          {
            path : 'via',
            title: 'via',
            loadComponent : () => import('./pages/maestros/via/via-pagination/via.component'),
          },
          {
            path : 'via-edit/:id',
            title: 'via',
            loadComponent : () => import('./pages/maestros/via/via-edit/via-edit.component'),
            canDeactivate : [exitGuard]
          },

          {
            path : 'sector',
            title: 'sector',
            loadComponent : () => import('./pages/maestros/sector/sector-pagination/sector-pagination.component'),
          },
          {
            path : 'sector-edit/:id',
            title: 'sector',
            loadComponent : () => import('./pages/maestros/sector/sector-edit/sector-edit.component'),
            canDeactivate : [exitGuard]
          },

          {
            path : 'paquete',
            title: 'paquete',
            loadComponent : () => import('./pages/maestros/paquete/paquetes-pagination/paquetes-pagination.component'),
          },
          {
            path : 'paquete-edit/:id',
            title: 'paquete',
            loadComponent : () => import('./pages/maestros/paquete/paquete-edit/paquete-edit.component'),
            canDeactivate : [exitGuard]
          },
          {
            path : 'almacen',
            title: 'Almacen',
            loadComponent : () => import('./pages/maestros/almacen/almcen-pagination/almcen-pagination.component'),
          },
          {
            path : 'almacen-edit/:id',
            title: 'almacen',
            loadComponent : () => import('./pages/maestros/almacen/almcen-edit/almcen-edit.component'),
            canDeactivate : [exitGuard]
          },

          // maestros delivery network
          {
            path : 'community',
            title: 'Community',
            loadComponent : () => import('./pages/maestros/community/community-pagination/community.component'),
          },
          {
            path : 'community-edit/:id',
            title: 'Comunity edit',
            loadComponent : () => import('./pages/maestros/community/community-edit/community-edit.component'),
            canDeactivate : [exitGuard]
          },

          {
            path : 'leader',
            title: 'Lider',
            loadComponent : () => import('./pages/maestros/leader/leader-pagination/leader.component'),
          },
          {
            path : 'leader-edit/:id',
            title: 'Lider edit',
            loadComponent : () => import('./pages/maestros/leader/leader-edit/leader-edit.component'),
            canDeactivate : [exitGuard]
          },

          {
            path : 'functionalLeader',
            title: 'Lider Funcional',
            loadComponent : () => import('./pages/maestros/functional-leader/functional-leader-pagination/functional-leader.component'),
          },
          {
            path : 'functionalLeader-edit/:id',
            title: 'Lider Funcional edit',
            loadComponent : () => import('./pages/maestros/functional-leader/functional-leader-edit/functional-leader-edit.component'),
            canDeactivate : [exitGuard]
          },
          {
            path : 'rol',
            title: 'Rol colaborador',
            loadComponent : () => import('./pages/maestros/rol/rol-pagination/rol.component'),
          },
          {
            path : 'rol-edit/:id',
            title: 'Rol colaborador',
            loadComponent : () => import('./pages/maestros/rol/rol-edit/rol-edit.component'),
            canDeactivate : [exitGuard]
          },
          {
            path : 'collaborator',
            title: 'Colaborador',
            loadComponent : () => import('./pages/maestros/collaborator/collaborator-pagination/collaborator.component'),
          },
          {
            path : 'collaborator-edit/:id',
            title: 'Colaborador',
            loadComponent : () => import('./pages/maestros/collaborator/collaborator-edit/collaborator-edit.component'),
            canDeactivate : [exitGuard]
          },
        ]

      }
    ]
  },
  {
    path : '',
    redirectTo : '/app/login',
    pathMatch: 'full'
  }



];
