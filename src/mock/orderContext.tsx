import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Order, OrderEvent, OrderStatus } from '../types/order';
import { MOCK_ORDERS } from './orderData';
import { useNotification } from './notificationContext';
import { useAudit } from './auditContext';

interface OrderContextType {
  orders: Order[];
  orderEvents: OrderEvent[];
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'assignedMachineIds'>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, actor: string, remarks?: string) => void;
  assignMachinesToOrder: (orderId: string, machineIds: string[], actor: string) => void;
  updateOrderDetails: (orderId: string, updates: Partial<Order>, actor: string, remarks?: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS as unknown as Order[]);
  const [orderEvents, setOrderEvents] = useState<OrderEvent[]>([]);
  const { addNotification } = useNotification();
  const { addAuditLog } = useAudit();

  const logEvent = (orderId: string, status: OrderStatus, actor: string, remarks?: string) => {
    setOrderEvents(prev => [...prev, {
      id: `evt-${Date.now()}-${Math.random()}`,
      orderId,
      status,
      timestamp: new Date().toISOString(),
      actor,
      remarks,
    }]);
  };

  const addOrder = (data: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'assignedMachineIds'>) => {
    const year = new Date().getFullYear();
    const count = orders.filter(o => o.orderNumber.includes(`ORD-${year}-`)).length + 1;
    const orderNumber = `ORD-${year}-${count.toString().padStart(6, '0')}`;
    
    const newOrder: Order = {
      ...data,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 'requested',
      assignedMachineIds: [],
    };
    
    setOrders([...orders, newOrder]);
    logEvent(newOrder.id, 'requested', data.createdBy, 'Order requested');

    addAuditLog({
      actorId: newOrder.createdBy,
      actorName: 'User',
      actorRole: 'company',
      action: 'Created Order',
      entityType: 'order',
      entityId: newOrder.id,
    });
    
    addNotification({
      recipientId: 'admin',
      title: 'New Order Request',
      message: `Order ${newOrder.orderNumber} received`,
      category: 'order',
      relatedEntityId: newOrder.id,
      relatedEntityType: 'order'
    });
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, actor: string, remarks?: string) => {
    let updatedOrder: Order | undefined;
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const updates: Partial<Order> = { status };
      
      const now = new Date().toISOString();
      if (status === 'approved') updates.approvedAt = now;
      if (status === 'dispatched') updates.dispatchedAt = now;
      if (status === 'delivered') updates.deliveredAt = now;
      if (status === 'installed') updates.installedAt = now;
      if (status === 'completed') updates.completedAt = now;

      return { ...o, ...updates };
    }));
    
    logEvent(orderId, status, actor, remarks);
  };

  const assignMachinesToOrder = (orderId: string, machineIds: string[], actor: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, assignedMachineIds: machineIds, status: 'machines_assigned' } : o));
    logEvent(orderId, 'machines_assigned', actor, `Assigned ${machineIds.length} machines`);
  };

  const updateOrderDetails = (orderId: string, updates: Partial<Order>, actor: string, remarks?: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updates } : o));
    if (remarks) {
      // Find current status to log a synthetic event for the update
      const currentOrder = orders.find(o => o.id === orderId);
      if (currentOrder) {
        logEvent(orderId, currentOrder.status, actor, remarks);
      }
    }
  };

  return (
    <OrderContext.Provider value={{
      orders, orderEvents, addOrder, updateOrderStatus, assignMachinesToOrder, updateOrderDetails
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
