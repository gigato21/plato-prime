import { HomeIcon, MessageSquare, Store, Users, MapPin, Share2, LayoutList, Image, ClipboardList, Shield, Bot, Settings, Clock, Menu, Map, Truck, Monitor, Bike, BarChart2 } from "lucide-react";

export const navItems = (localId) => {
  const items = [
    {
      label: "Token Monitor",
      path: "/token-monitor",
      icon: Shield,
      allowedRoles: ['superadmin']
    },
    {
      label: "Dashboard",
      path: "/",
      icon: HomeIcon,
      allowedRoles: ['admin', 'worker', 'superadmin']
    },
    {
      label: "Órdenes",
      path: "/orders",
      icon: ClipboardList,
      allowedRoles: ['admin', 'worker', 'superadmin']
    },
    {
      label: "WhatsApp",
      path: "/whatsapp",
      icon: MessageSquare,
      allowedRoles: ['admin', 'worker', 'superadmin']
    },
    {
      label: "Gestor de Menú",
      path: "/menu-manager",
      icon: LayoutList,
      allowedRoles: ['admin', 'worker', 'superadmin']
    },
    {
      label: "Personal",
      path: "/staff",
      icon: Users,
      allowedRoles: ['admin', 'superadmin']
    },
    {
      label: "Zonas de Entrega",
      path: "/delivery-zones",
      icon: MapPin,
      allowedRoles: ['admin', 'worker', 'superadmin']
    },
    {
      label: "Galería",
      path: "/gallery",
      icon: Image,
      allowedRoles: ['admin', 'superadmin']
    },
    {
      label: "Configuracion",
      path: "/restaurant",
      icon: Settings,
      allowedRoles: ['admin', 'superadmin']
    },
    {
      label: "Motorizados",
      path: "/delivery-management",
      icon: Truck,
      allowedRoles: ['admin', 'superadmin']
    },
    {
      label: "Integraciones",
      path: "/integration",
      icon: Settings,
      allowedRoles: ['admin', 'superadmin']
    }
  ];

  if (localId) {
    items.push({
      label: "Bot Config",
      path: "/bot-config",
      icon: Bot,
      allowedRoles: ['superadmin', 'admin']
    });
 
  }

  return items;
};

export const superadminNavItems = (localId, subDomain) => {
  if (!localId || !subDomain) {
    return [
      {
        label: "Monitor de Tokens",
        path: "/token-monitor",
        icon: Shield,
        allowedRoles: ['superadmin']
      },
      {
        label: "Delivery Global",
        path: "/super-delivery",
        icon: Bike,
        allowedRoles: ['superadmin']
      },
      {
        label: "Dashboard Global",
        path: "/super-dashboard",
        icon: BarChart2,
        allowedRoles: ['superadmin']
      },
      {
        label: "Órdenes Globales",
        path: "/super-orders",
        icon: ClipboardList,
        allowedRoles: ['superadmin']
      }
    ];
  }
  const items = [
    {
      label: "Dashboard",
      path: "/",
      icon: HomeIcon,
      allowedRoles: ['superadmin']
    },
    {
      label: "Dashboard Global",
      path: "/super-dashboard",
      icon: BarChart2,
      allowedRoles: ['superadmin']
    },
    {
      label: "Órdenes Globales",
      path: "/super-orders",
      icon: ClipboardList,
      allowedRoles: ['superadmin']
    },
    {
      label: "Órdenes",
      path: "/orders", 
      icon: ClipboardList,
      allowedRoles: ['superadmin']
    },
    {
      label: "WhatsApp",
      path: "/whatsapp",
      icon: MessageSquare,
      allowedRoles: ['superadmin']
    },
    {
      label: "Gestor de Menú",
      path: "/menu-manager",
      icon: LayoutList,
      allowedRoles: ['superadmin']
    },
    {
      label: "Personal",
      path: "/staff", 
      icon: Users,
      allowedRoles: ['superadmin']
    },
    {
      label: "Zonas de Entrega",
      path: "/delivery-zones",
      icon: MapPin,
      allowedRoles: ['superadmin']
    },
    {
      label: "Galería",
      path: "/gallery",
      icon: Image,
      allowedRoles: ['superadmin']
    },
    {
      label: "Configuracion", 
      path: "/restaurant",
      icon: Settings,
      allowedRoles: ['superadmin']
    },
    {
      label: "Monitor de Tokens",
      path: "/token-monitor",
      icon: Shield,
      allowedRoles: ['superadmin']
    },
 
  ];

  if(localId === "-1"){
    items.push({
      label: "Bot Config",
      path: "/bot-config",
      icon: Bot,
      allowedRoles: ['superadmin', 'admin', 'worker']
    });
    
    items.push({
      label: "Integraciones",
      path: "/integration",
      icon: Settings,
      allowedRoles: ['superadmin', 'admin', 'worker']
    });
  }

  return items;
};
