export interface Categoria {
  categoria_id: string;
  local_id: string;
  categoria_descripcion: string;
  categoria_estado: string;
  categoria_padreid: string;
  categoria_color: string;
  categoria_delivery: string;
  categoria_orden: string;
  categoria_urlimagen: string | null;
  categoria_checksum: string;
}

export interface Oferta {
  // Basado en la estructura, parece que oferta siempre es null en los ejemplos visualizados
  // Si en el futuro se encuentra información sobre la estructura de las ofertas, se debe actualizar este tipo
  [key: string]: unknown;
}

export interface Nota {
  // Basado en la estructura, parece que notas siempre es un array vacío en los ejemplos visualizados
  // Si en el futuro se encuentra información sobre la estructura de las notas, se debe actualizar este tipo
  [key: string]: unknown;
}

export interface ProductoBase {
  // Basado en la estructura, parece que lista_productobase siempre es un array vacío en los ejemplos visualizados
  // Si en el futuro se encuentra información sobre la estructura de los productos base, se debe actualizar este tipo
  [key: string]: unknown;
}

export interface ProductoAdicional {
  // Basado en la estructura, parece que lista_productoadicional siempre es un array vacío en los ejemplos visualizados
  // Si en el futuro se encuentra información sobre la estructura de los productos adicionales, se debe actualizar este tipo
  [key: string]: unknown;
}

export interface ModificadorSeleccion {
  modificadorseleccion_id: string;
  modificadorseleccion_nombre: string;
  modificadorseleccion_precio: string;
  modificadorseleccion_precio_sincomision: string;
  modificadorseleccion_tipo: string;
  modificadorseleccion_espordefecto: string;
  modificadorseleccion_urlimagen: string | null;
  productogeneralmodificador_cantidadmaxima: string;
  productogeneralmodificador_cantidadminima: string;
  productogeneralmodificador_orden: string;
  productogeneralmodificador_stock: string;
}

export interface Agrupador {
  modificador_id: string;
  modificador_nombre: string;
  modificador_esmultiple: string;
  modificador_cantidadminima: string;
  modificador_cantidadmaxima: string;
  listaModificadores: ModificadorSeleccion[];
}

export interface Presentacion {
  producto_id: string;
  producto_presentacion: string;
  producto_precio_sincomision: string;
  producto_precio: string;
  producto_delivery: string;
  producto_urlimagen: string;
  producto_agotado: string;
  producto_sevendealpeso: string;
  producto_checksum: string;
  producto_costo: string;
  producto_stock: string;
  producto_controlstock: string;
  producto_nombre: string;
  categoria_descripcion: string;
  oferta: Oferta | null;
}

export interface Producto {
  productogeneral_id: string;
  productogeneral_descripcion: string;
  productogeneral_descripcionplato: string;
  productogeneral_descripcionweb: string | null;
  productogeneral_escombo: string;
  productogeneral_preciofijo: string;
  productogeneral_noalteratotalcambio: string;
  productogeneral_totalpreciomayor: string;
  productogeneral_leysunat: string;
  productogeneral_textoadicionales: string;
  productogeneral_textoproductosbase: string;
  productogeneral_preciominimopresentacion: string;
  productogeneral_agotado: string;
  productogeneral_agruparcambios: string;
  productogeneral_inafectoimpuestos: string;
  productogeneral_exoneradoimpuestos: string;
  productogeneral_checksum: string;
  productogeneral_urlimagen: string;
  marca_id: string | null;
  notas: Nota[];
  lista_presentacion: Presentacion[];
  lista_productobase: ProductoBase[];
  lista_productoadicional: ProductoAdicional[];
  lista_agrupadores: Agrupador[];
  categoria_id: string;
  categoria_descripcion: string;
  categoria_ordenCombinado: string;
}

export interface TimeOperation {
  [index: number]: string;
}

export interface ResponseData {
  mensajes: string[];
  tipo: string;
  data: {
    menu: Producto[];
    categorias: Categoria[];
    totalRegistros: number;
    porcentajecomision: number;
    canaldelivery_id: number;
    integracion_id: string;
    listaOfertas: Oferta[];
    timeOperation: string[];
  }
}

export default ResponseData;