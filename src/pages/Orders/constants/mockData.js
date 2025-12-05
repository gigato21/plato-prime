export const mockOrders = [
  {
    id: "1",
    date: new Date(),
    customer: "Juan Pérez",
    phone: "+51 987654321",
    total: 45.50,
    status: "pending",
    items: ["Pizza Margherita", "Coca-Cola"],
    orderType: "delivery",
    paymentMethod: "cash",
    method: "ia_wsp",
  },
  {
    id: "2",
    date: new Date(),
    customer: "María García",
    phone: "+51 987654322",
    total: 32.00,
    status: "confirmed",
    items: ["Hamburguesa Clásica", "Papas Fritas"],
    orderType: "pickup",
    paymentMethod: "card",
    method: "digital_menu",
  },
  {
    id: "3",
    date: new Date(),
    customer: "Carlos López",
    phone: "+51 987654323",
    total: 65.90,
    status: "preparing",
    items: ["Pollo a la Brasa", "Ensalada", "Gaseosa"],
    orderType: "delivery",
    paymentMethod: "card",
    method: "ia_wsp",
  },
  {
    id: "4",
    date: new Date(),
    customer: "Ana Torres",
    phone: "+51 987654324",
    total: 28.50,
    status: "ready",
    items: ["Sushi Roll x8", "Té Verde"],
    orderType: "pickup",
    paymentMethod: "cash",
    method: "digital_menu",
  },
  {
    id: "5",
    date: new Date(),
    customer: "Luis Ramírez",
    phone: "+51 987654325",
    total: 42.00,
    status: "pending",
    items: ["Pasta Carbonara", "Vino Tinto"],
    orderType: "delivery",
    paymentMethod: "card",
    method: "ia_wsp",
  }
];

export const columns = [
  { id: 'Aceptado', title: 'Aceptado' },
  { id: 'En cocina', title: 'En Cocina' },
  { id: 'En camino', title: 'En Camino' },
  { id: 'Entregado', title: 'Entregado' }
];

export const statusStyles = {
  'Aceptado': "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  'En cocina': "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  'En camino': "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  'Entregado': "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
};

export const statusLabels = {
  'Aceptado': "Aceptado",
  'En cocina': "En cocina",
  'En camino': "En camino",
  'Entregado': "Entregado"
};

export const orderTypeLabels = {
  delivery: "Delivery",
  pickup: "Recojo en tienda",
};

export const methodLabels = {
  ia_wsp: "IA WhatsApp",
  digital_menu: "Carta Digital",
};

export const orderSourceLabels = {
  0: "Carta Digital",
  1: "WhatsApp",
}; 