// Datos simulados para la integración

export const mockCategories = {
  restpeCategories: [
    { id: 1, code: "C001", name: "Pollos", active: true },
    { id: 2, code: "C002", name: "Bebidas", active: true },
    { id: 3, code: "C003", name: "Guarniciones", active: true },
    { id: 4, code: "C004", name: "Postres", active: true },
    { id: 5, code: "C005", name: "Promociones", active: true },
    { id: 6, code: "C006", name: "Entradas", active: true },
    { id: 7, code: "C007", name: "Platos Especiales", active: true },
    { id: 8, code: "C008", name: "Menú Infantil", active: true }
  ],
  cartaaiCategories: [
    { id: 101, rId: null, name: "Pollos a la Brasa", active: true },
    { id: 102, rId: null, name: "Refrescos", active: true },
    { id: 103, rId: null, name: "Acompañamientos", active: true },
    { id: 104, rId: null, name: "Postres", active: true },
    { id: 105, rId: null, name: "Combos", active: true },
    { id: 106, rId: null, name: "Aperitivos", active: true },
    { id: 107, rId: null, name: "Especialidades", active: true },
    { id: 108, rId: null, name: "Para Niños", active: true }
  ]
};

export const mockProducts = {
  restpeProducts: [
    {
      id: 1, 
      code: "792",
      name: "PROMO MOSTRUO",
      presentation: "LL-D", 
      internalCode: "1420",
      price: 49.9,
      categoryId: 5
    },
    {
      id: 2, 
      code: "769",
      name: "1/4 POLLO + GUARNICION",
      presentation: "TRADICIONAL", 
      internalCode: "1391",
      price: 21.9,
      categoryId: 1
    },
    {
      id: 3, 
      code: "769",
      name: "1/4 POLLO + GUARNICION",
      presentation: "PICANTE", 
      internalCode: "1576",
      price: 19.9,
      categoryId: 1
    },
    {
      id: 4, 
      code: "456",
      name: "1/2 POLLO",
      presentation: "PORCION 1/2", 
      internalCode: "489",
      price: 49.9,
      categoryId: 1
    },
    {
      id: 5, 
      code: "567",
      name: "JARRA DE SANGRIA",
      presentation: "CAJA DE 12 LITROS", 
      internalCode: "895",
      price: 20,
      categoryId: 2
    },
    {
      id: 6,
      code: "123",
      name: "TEQUEÑOS",
      presentation: "6 UNIDADES",
      internalCode: "234",
      price: 15.9,
      categoryId: 6
    },
    {
      id: 7,
      code: "234",
      name: "POLLO BROASTER",
      presentation: "FAMILIAR",
      internalCode: "567",
      price: 55.9,
      categoryId: 7
    },
    {
      id: 8,
      code: "345",
      name: "NUGGETS DE POLLO",
      presentation: "KIDS",
      internalCode: "678",
      price: 18.9,
      categoryId: 8
    }
  ],
  cartaaiProducts: [
    {
      id: 101,
      rId: null,
      name: "PROMO MOSTRUO",
      presentation: "1/2 POLLO",
      description: "POLLO CON PAPAS Y CHAUFA",
      price: 49.9,
      categoryId: 105
    },
    {
      id: 102,
      rId: null,
      name: "1/4 POLLO + GUARNICION",
      presentation: "1/4 POLLO + GUARNICION TRADICIONAL",
      description: "1/4 POLLO + GUARNICION",
      price: 19.9,
      categoryId: 101
    },
    {
      id: 103,
      rId: null,
      name: "1/4 POLLO + GUARNICION",
      presentation: "1/4 POLLO + GUARNICION PICANTE",
      description: "1/4 POLLO + GUARNICION",
      price: 19.9,
      categoryId: 101
    },
    {
      id: 104,
      rId: null,
      name: "1/2 POLLO",
      presentation: "1/2 POLLO RIKISIMO",
      description: "1/2 POLLO RIKISIMO",
      price: 49.9,
      categoryId: 101
    },
    {
      id: 105,
      rId: null,
      name: "JARRA DE SANGRIA",
      presentation: "REFRESCNTE SANGRIA",
      description: "SANGRIA MAS GASEOSA",
      price: 20,
      categoryId: 102
    },
    {
      id: 106,
      rId: null,
      name: "TEQUEÑOS MIXTOS",
      presentation: "6 UNIDADES SURTIDAS",
      description: "TEQUEÑOS DE QUESO Y JAMÓN",
      price: 15.9,
      categoryId: 106
    },
    {
      id: 107,
      rId: null,
      name: "POLLO BROASTER FAMILIAR",
      presentation: "8 PIEZAS + PAPAS",
      description: "POLLO CRUJIENTE CON PAPAS Y ENSALADA",
      price: 55.9,
      categoryId: 107
    },
    {
      id: 108,
      rId: null,
      name: "NUGGETS KIDS",
      presentation: "6 NUGGETS + PAPAS",
      description: "NUGGETS DE POLLO CON PAPAS Y GASEOSA",
      price: 18.9,
      categoryId: 108
    }
  ]
};

// Datos simulados para modificadores
export const mockModifiers = {
  restpeModifiers: [
    {
      id: 1,
      code: "MOD001",
      name: "SIN SAL",
      price: 0,
      active: true,
      group: "Preferencias"
    },
    {
      id: 2,
      code: "MOD002",
      name: "SIN CEBOLLA",
      price: 0,
      active: true,
      group: "Preferencias"
    },
    {
      id: 3,
      code: "MOD003",
      name: "EXTRA QUESO",
      price: 3.5,
      active: true,
      group: "Agregados"
    },
    {
      id: 4,
      code: "MOD004",
      name: "PORCIÓN ADICIONAL",
      price: 7.9,
      active: true,
      group: "Agregados"
    },
    {
      id: 5,
      code: "MOD005",
      name: "CAMBIAR POR PAPAS",
      price: 2,
      active: true,
      group: "Cambios"
    },
    {
      id: 6,
      code: "MOD006",
      name: "PICANTE ADICIONAL",
      price: 1.5,
      active: true,
      group: "Salsas"
    },
    {
      id: 7,
      code: "MOD007",
      name: "PARA LLEVAR",
      price: 1,
      active: true,
      group: "Empaque"
    },
    {
      id: 8,
      code: "MOD008",
      name: "BEBIDA HELADA",
      price: 0,
      active: true,
      group: "Preferencias"
    }
  ],
  cartaaiModifiers: [
    {
      id: 201,
      rId: null,
      name: "Sin sal",
      price: 0,
      active: true,
      group: "Preferencias"
    },
    {
      id: 202,
      rId: null,
      name: "Sin cebolla",
      price: 0,
      active: true,
      group: "Preferencias"
    },
    {
      id: 203,
      rId: null,
      name: "Añadir queso",
      price: 3.5,
      active: true,
      group: "Agregados"
    },
    {
      id: 204,
      rId: null,
      name: "Porción extra",
      price: 7.9,
      active: true,
      group: "Agregados"
    },
    {
      id: 205,
      rId: null,
      name: "Cambiar por papas fritas",
      price: 2,
      active: true,
      group: "Cambios"
    },
    {
      id: 206,
      rId: null,
      name: "Nivel picante extra",
      price: 1.5,
      active: true,
      group: "Salsas"
    },
    {
      id: 207,
      rId: null,
      name: "Empaque para llevar",
      price: 1,
      active: true,
      group: "Empaque"
    },
    {
      id: 208,
      rId: null,
      name: "Bebida con hielo",
      price: 0,
      active: true,
      group: "Preferencias"
    }
  ],
  // Grupos de modificadores definidos
  modifierGroups: [
    { id: 1, name: "Preferencias", orderIndex: 1 },
    { id: 2, name: "Agregados", orderIndex: 2 },
    { id: 3, name: "Cambios", orderIndex: 3 },
    { id: 4, name: "Salsas", orderIndex: 4 },
    { id: 5, name: "Empaque", orderIndex: 5 }
  ]
};

// Estados para la integración
export const integrationSteps = [
  {
    id: 1,
    name: 'Categorías',
    completed: false,
    current: true
  },
  {
    id: 2,
    name: 'Productos',
    completed: false,
    current: false
  }
  // Paso de modificadores temporalmente comentado
  /*
  {
    id: 2,
    name: 'Modificadores',
    completed: false,
    current: false
  },
  {
    id: 3,
    name: 'Productos',
    completed: false,
    current: false
  }
  */
];

// Simulación de respuesta del endpoint de integración
export const simulateIntegrationResponse = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        categories: mockCategories,
        products: mockProducts,
        modifiers: mockModifiers,
        steps: integrationSteps
      });
    }, 1500); // Simular demora de red
  });
}; 