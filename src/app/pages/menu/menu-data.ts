import { Menu } from "./menu.interface";



export const MENU_DATA: Menu = {
  categorias: [
    {
      id: 10,
      nombre: 'Inicio',
      icon: 'home',
      url : '',

    },
    {
      id: 20,
      nombre: 'Operaciones',
      icon: 'folder_oopen',
      url : '',
      subcategorias : [
        {
          id:1,
          nombre: 'Disponible',
          icon: 'settings_input_hdmi',
          url : 'user'
        },
        {
          id:2,
          nombre: 'Mapeo tecnologias ',
          icon: 'phonelink_erase',
          url : ''
        },
        {
          id:2,
          nombre: 'Search',
          icon: 'group_add',
          url : 'cliente'
        }
      ]

    },
    {
      id: 30,
      nombre: 'Cobranza',
      icon: 'attach_money',
      url : '',
      subcategorias : [
        {
          id:1,
          nombre: 'Registro Caja',
          icon: 'attach_money',
          url : 'user'
        },
        {
          id:1,
          nombre: 'Apertura',
          icon: 'create_new_folder',
          url : ''
        }
      ]

    },
    {
      id: 40,
      nombre: 'Planta ext',
      icon: 'public',
      url : '',
      subcategorias : [
        {
          id:1,
          nombre: 'Ingenieria',
          icon: 'domain',
          url : 'user'
        },
        {
          id:1,
          nombre: 'Aprovision',
          icon: 'public',
          url : ''
        }
      ]
    },
    {
      id: 50,
      nombre: 'Maestros',
      icon: 'sort',
      url : '',
      subcategorias : [
        {
          id:1,
          nombre: 'Tipo Doc Iden',
          icon: 'insert_drive_file',
          url : 'tipo-documento-identidad'
        },
        {
          id:1,
          nombre: 'Tipo Docum.',
          icon: 'subtitles',
          url : ''
        },
        {
          id:1,
          nombre: 'Tipo Via',
          icon: 'sort',
          url : 'tipo-via'
        },
        {
          id:1,
          nombre: 'Vias',
          icon: 'subtitles',
          url : 'via'
        },
        {
          id:1,
          nombre: 'Sectores',
          icon: 'subtitles',
          url : ''
        },
        {
          id:1,
          nombre: 'Almacen',
          icon: 'almacen',
          url : 'almacen'
        },
      ]

    },
  ]
}
