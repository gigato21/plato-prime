import { getApiUrls } from '@/config/api';

const API_URLS = getApiUrls();

export const fetchAutoChangeStatus = async (subDomain, localId) => {
  const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/business?subDomain=${subDomain}&localId=${localId}`);
  if (!response.ok) throw new Error("Error al obtener el estado de auto-cambio");
  const data = await response.json();
  return data.data.timerOrderUpdateIsActive;
};

export const fetchProductDetails = async (localId, subDomain, productIds) => {
  const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/menu/getProductInMenu/${localId}/${subDomain}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productIds),
  });
  if (!response.ok) throw new Error("Error al obtener los detalles de los productos");
  return await response.json();
};

export const fetchOrders = async (subDomain, localId) => {
  try {
    const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/order/filled-orders/${subDomain}/${localId}`);
    if (!response.ok) throw new Error("Error en la petición de órdenes");
    const data = await response.json();
    const timerConfig = data.timerConfig;
    console.log(data, 'data')

    // Transformamos los datos al formato que necesitamos
    const orders = data.filledOrders.map(order => ({
      id: order._id,
      integrationStatus: order.integrationStatus,
      refId: order.refId,
      date: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt),
      customer: `${order.client.clienteNombres} ${order.client.clienteApellidos}`,
      phone: order.client.clienteTelefono,
      total: order.delivery.paymentAmount,
      status: order.status,
      subDomain: order.subDomain,
      localId: order.localId,
      localName: order.localName,
      orderSource: order.orderSource,
      // Incluimos el cliente completo
      clientInfo: {
        id: order.client._id,
        nombres: order.client.clienteNombres,
        apellidos: order.client.clienteApellidos,
        dniRuc: order.client.clienteDniRuc,
        email: order.client.clienteEmail,
        telefono: order.client.clienteTelefono,
        tipo: order.client.clienteTipo,
        validacion: order.client.validacionCliente
      },
      items: order.productList.map(product => ({
        id: product._id,
        productId: product.productId,
        name: product.name || 'Producto no encontrado',
        quantity: product.quantity,
        price: product.price,
        discount: product.discount || 0,
        note: product.note || '',
        description: product.description || '',
        isCombo: product.isCombo || 'N',
        modificatorSelectionList: product.modificatorSelectionList || [],
        comboProductList: product.comboProductList || [],
        additionalListAdded: product.additionalListAdded || []
      })),
      orderType: order.delivery.mode ===  0 ? 'delivery' : 'pickup',
      paymentMethod: order.delivery.paymentType === 1 ? 'efectivo' : 'tarjeta',
      method: order.orderSource === 1 ? 'ia_wsp' : 'digital_menu',
      deliveryInfo: {
        cost: order.delivery.cost,
        paymentAmount: order.delivery.paymentAmount,
        discountAmount: order.delivery.discountAmount || 0,
        paymentType: order.delivery.paymentType,
        cardId: order.delivery.cardId || null,
        mode: order.delivery.mode,
        reference: order.delivery.reference,
        referencePerson: order.delivery.referencePerson,
        generalNote: order.delivery.generalNote,
        pickupPerson: order.delivery.pickupPerson || null,
        pickupTime: order.delivery.pickupTime,
        deliveryTime: order.delivery.deliveryTime,
        endTime: order.delivery.endTime || null,
        alertMinutes: order.delivery.alertMinutes || 0,
        receipt: order.delivery.receipt || 0,
        billingName: order.delivery.billingName || '',
        billingAddress: order.delivery.billingAddress || '',
        code: order.delivery.code || '',
        latitude: order.delivery.latitude || null,
        longitude: order.delivery.longitude || null
      }
    }));
    return {orders, timerConfig};

  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const fetchOrdersAdmin = async (startDate = '', endDate = '', page = 1) => {
  try {
    let url = `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/order/filled-orders/admin?page=${page}&limit=10`;
    
    if (startDate && endDate) {
      url += `&startDate=${startDate}&endDate=${endDate}`;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error("Error en la petición de órdenes");
    const data = await response.json();
    console.log(data.pagination, 'response')
    const timerConfig = data.timerConfig;
 

    // Transformamos los datos al formato que necesitamos
    const orders = data.filledOrders.map(order => ({
      id: order._id,
      integrationStatus: order.integrationStatus,
      refId: order.refId,
      date: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt),
      customer: `${order.client.clienteNombres} ${order.client.clienteApellidos}`,
      phone: order.client.clienteTelefono,
      total: order.delivery.paymentAmount,
      status: order.status,
      subDomain: order.subDomain,
      localId: order.localId,
      localName: order.localName,
      orderSource: order.orderSource,
      // Incluimos el cliente completo
      clientInfo: {
        id: order.client._id,
        nombres: order.client.clienteNombres,
        apellidos: order.client.clienteApellidos,
        dniRuc: order.client.clienteDniRuc,
        email: order.client.clienteEmail,
        telefono: order.client.clienteTelefono,
        tipo: order.client.clienteTipo,
        validacion: order.client.validacionCliente
      },
      items: order.productList.map(product => ({
        id: product._id,
        productId: product.productId,
        name: product.name || 'Producto no encontrado',
        quantity: product.quantity,
        price: product.price,
        discount: product.discount || 0,
        note: product.note || '',
        description: product.description || '',
        isCombo: product.isCombo || 'N',
        modificatorSelectionList: product.modificatorSelectionList || [],
        comboProductList: product.comboProductList || [],
        additionalListAdded: product.additionalListAdded || []
      })),
      orderType: order.delivery.mode ===  0 ? 'delivery' : 'pickup',
      paymentMethod: order.delivery.paymentType === 1 ? 'efectivo' : 'tarjeta',
      method: order.orderSource === 1 ? 'ia_wsp' : 'digital_menu',
      deliveryInfo: {
        cost: order.delivery.cost,
        paymentAmount: order.delivery.paymentAmount,
        discountAmount: order.delivery.discountAmount || 0,
        paymentType: order.delivery.paymentType,
        cardId: order.delivery.cardId || null,
        mode: order.delivery.mode,
        reference: order.delivery.reference,
        referencePerson: order.delivery.referencePerson,
        generalNote: order.delivery.generalNote,
        pickupPerson: order.delivery.pickupPerson || null,
        pickupTime: order.delivery.pickupTime,
        deliveryTime: order.delivery.deliveryTime,
        endTime: order.delivery.endTime || null,
        alertMinutes: order.delivery.alertMinutes || 0,
        receipt: order.delivery.receipt || 0,
        billingName: order.delivery.billingName || '',
        billingAddress: order.delivery.billingAddress || '',
        code: order.delivery.code || '',
        latitude: order.delivery.latitude || null,
        longitude: order.delivery.longitude || null
      }
    }));

    return {
      orders,
      timerConfig,
      pagination: {
        total: data.pagination.total || 0,
        totalPages: Math.ceil((data.pagination.total || 0) / 10)
      }
    };

  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};


export const sendAutoChangeConfig = async (subDomain, localId, isActive, intervalMinutes) => {
  try {
    const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/order/change-status/${subDomain}/${localId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        isActive, 
        intervalTime: intervalMinutes * 60000 // Convertir minutos a milisegundos
      }),
    });

    if (!response.ok) {
      throw new Error("Error al configurar el cambio automático de estados");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, newStatus, statusReason = '') => {
  try {
    const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/order/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: newStatus,
        statusReason: statusReason
      })
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el estado de la orden');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const fetchOrderById = async (orderId) => {
  const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/order/get-order/${orderId}`);
  if (!response.ok) throw new Error("Error al obtener los detalles de la orden");
  const data = await response.json();
  return data.data;
};