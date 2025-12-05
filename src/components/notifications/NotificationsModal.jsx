import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "./NotificationsProvider";
import { useEffect } from "react";
import { getApiUrls } from '@/config/api';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const NotificationsModal = () => {
  const API_URLS = getApiUrls();
  const { notifications, isModalOpen, setIsModalOpen, fetchUnreadNotifications, setUnreadCount } = useNotifications();
  const accessToken = useSelector(state => state.auth.accessToken);

  useEffect(() => {
    if (isModalOpen) {
      fetchUnreadNotifications();
    }
  }, [isModalOpen, fetchUnreadNotifications]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Fecha no disponible';
    }
  };

  const handleNotificationClick = async (notificationId) => {
    try {
      const response = await fetch(
        `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/notifications/${notificationId}/read`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        setUnreadCount(prev => Math.max(0, prev - 1));
        fetchUnreadNotifications();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Notificaciones</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] w-full pr-4">
          <AnimatePresence>
            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                    className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm 
                             hover:bg-accent hover:scale-[1.02] cursor-pointer
                             transition-all duration-200 ease-in-out"
                    onClick={() => handleNotificationClick(notification._id)}
                  >
                    <p className="text-sm font-medium">{notification.message}</p>
                    <span className="text-xs text-muted-foreground mt-2 block">
                      {formatDate(notification.createdAt)}
                    </span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-muted-foreground py-8"
              >
                <p className="text-lg">No hay notificaciones</p>
                <p className="text-sm mt-2">Las notificaciones aparecerán aquí</p>
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsModal;