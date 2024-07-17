export interface Subcategoria {
  id:number;
  nombre:string;
  icon:string;
  url:string;
}

export interface Categoria {
  id:number;
  nombre:string;
  icon:string;
  url : string;
  subcategorias?: Subcategoria[];
}

export interface MenuPrime {
  label: string,
  icon:string,
}
