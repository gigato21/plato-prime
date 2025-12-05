export const setupSocketListeners = (socket, fetchProductDetails, setOrders, subDomain, localId) => {
  socket.on("newOrder", (newOrder) => {
    setOrders((prevOrders) => [newOrder, ...prevOrders]);
  });

  socket.on("statusUpdate", (updatedOrder) => {
    setOrders((prevOrders) => {
      return prevOrders.map((order) => 
        order._id === updatedOrder._id 
          ? { ...order, status: updatedOrder.status } 
          : order
      );
    });
  });
};