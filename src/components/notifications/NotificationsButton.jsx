import { BellDot } from 'lucide-react';
import { useNotifications } from './NotificationsProvider';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const NotificationsButton = () => {
  const { setIsModalOpen, unreadCount } = useNotifications();

  return (
    <button 
      onClick={() => setIsModalOpen(true)}
      className="relative p-2 rounded-full hover:bg-accent transition-colors duration-200"
    >
      <BellDot className={cn(
        "h-5 w-5 transition-colors duration-300",
        unreadCount > 0 ? "text-cartaai-red" : "text-foreground"
      )} />
      
      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="bg-cartaai-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
            >
              {unreadCount}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <span className="sr-only">Notificaciones</span>
    </button>
  );
};

export default NotificationsButton;