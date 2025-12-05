import { ChevronRight, Bot, BotOff, AlertTriangle } from 'lucide-react';
import { format, isToday } from 'date-fns';
import CustomerBadge from './CustomerBadge';
import OrderStatus from './OrderStatus';

const ChatListItem = ({ 
  chat, 
  activeChatId, 
  unreadChats, 
  botEnabled, 
  onSelect,
  hasNotification,
  onNotificationClick
}) => {
  const MAX_PREVIEW_LENGTH = 50;
  
  const truncateMessage = (message) => {
    if (!message) return '';
    if (message.length <= MAX_PREVIEW_LENGTH) {
      return message;
    }
    return message.slice(0, MAX_PREVIEW_LENGTH) + '...';
  };

  return (
    <div
      className={`flex items-center p-4 border-b border-cartaai-white/10 cursor-pointer hover:bg-cartaai-white/5 transition-all duration-200 
      ${chat.id === activeChatId ? 'bg-cartaai-red/10 border-r-2 border-cartaai-red' : ''}
      ${unreadChats.has(chat.phone) 
        ? chat.source === '51953425711' 
          ? 'bg-blue-500/20 dark:bg-blue-950/50' 
          : 'bg-red-500/20 dark:bg-red-950/50'
        : chat.source === '51953425711' 
          ? 'bg-transparent dark:bg-transparent' 
          : 'bg-transparent dark:bg-transparent'}`}
      onClick={onSelect}
    >
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <h3 className={`font-semibold text-sm text-gray-800 ${unreadChats.has(chat.phone) ? 'font-bold' : ''}`}>
              {chat.name}
            </h3>
            <CustomerBadge isNew={chat.isNewCustomer} />
            {!botEnabled ? (
              <BotOff className="w-4 h-4 text-gray-500" />
            ) : (
              <Bot className="w-4 h-4 text-green-500" />
            )}
            {hasNotification && (
              <div 
                className="relative inline-flex items-center justify-center cursor-pointer"
                onClick={onNotificationClick}
              >
                <AlertTriangle 
                  className="w-5 h-5 text-yellow-500 animate-pulse" 
                />
                <span className="absolute flex items-center justify-center w-3 h-3 bg-yellow-500 text-[8px] font-bold text-black rounded-full -top-1 -right-1">
                  !
                </span>
              </div>
            )}
          </div>
          <span className="text-xs text-cartaai-white/70">
            {isToday(chat.date) ? chat.time : format(chat.date, 'dd/MM/yyyy')}
          </span>
        </div>
        <p className={`text-sm text-cartaai-white/70 truncate mb-1 ${unreadChats.has(chat.phone) ? 'font-semibold' : ''}`}>
          {truncateMessage(chat.lastMessage)}
        </p>
        <div className="flex justify-between items-center">
          {chat.orderStatus && <OrderStatus status={chat.orderStatus} />}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-cartaai-white/70">Local: {chat.localName}</span>
            <ChevronRight className="text-cartaai-white/50" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;