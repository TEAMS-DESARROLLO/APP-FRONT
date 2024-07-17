import { Menu } from "./menu.interface";



export const MENU_DATA_PRIME = [
  {
    label: 'Comercial',
    items: [
        {
            label: 'Instalacion',
            shortcut: '⌘+N',
            icon: 'pi pi-wifi',

        },
        {
            label: 'Averias',
            icon: 'pi pi-bolt',
            shortcut: '⌘+S'
        },
        {
            label: 'Clientes',
            icon: 'pi pi-user',
            shortcut: '⌘+S',
            routerLink: 'cliente'
        },
    ]
  },
  {
    label: 'Maestros',
    items: [
        // {
        //     label: 'Tipo doc Ident.',
        //     icon: 'pi pi-file',
        //     shortcut: '⌘+O',
        //     routerLink: 'tipo-documento-identidad'
        // },
        // {
        //     label: 'Tipo de vias',
        //     icon: 'pi pi-indian-rupee',
        //     badge: '2',
        //     routerLink: 'tipo-via'
        // },
        // {
        //     label: 'Vias',
        //     icon: 'pi pi-list',
        //     shortcut: '⌘+Q',
        //     routerLink: 'via'
        // },
        // {
        //   label: 'Sectores',
        //   icon: 'pi pi-list',
        //   shortcut: '⌘+Q',
        //   routerLink: 'sector'
        // },
        // {
        //   label: 'Paquete',
        //   icon: 'pi pi-list',
        //   shortcut: '⌘+Q',
        //   routerLink: 'paquete'
        // },
        // {
        //   label: 'Almacen',
        //   icon: 'pi pi-list',
        //   shortcut: '⌘+Q',
        //   routerLink: 'almacen'
        // },
        //maestros delivery network
        {
          label: 'Communidad',
          icon: 'pi pi-list',
          shortcut: '⌘+Q',
          routerLink: 'community'
        },
        {
          label: 'Lideres Practica',
          icon: 'pi pi-list',
          shortcut: '⌘+Q',
          routerLink: 'leader'
        },
        {
          label: 'Lideres Funcionales',
          icon: 'pi pi-list',
          shortcut: '⌘+Q',
          routerLink: 'functionalLeader'
        },
        {
          label: 'Rol Colaborador',
          icon: 'pi pi-list',
          shortcut: '⌘+Q',
          routerLink: 'rol'
        },
        {
          label: 'Colaborador',
          icon: 'pi pi-list',
          shortcut: '⌘+Q',
          routerLink: 'collaborator'
        },
    ]
  },

]


