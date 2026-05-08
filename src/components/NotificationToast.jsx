import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useUIStore } from '../stores';
import { useEffect } from 'react';

const ICONS = {
  success: <CheckCircle className="w-4 h-4 text-[#16C784]" />,
  error: <XCircle className="w-4 h-4 text-[#EA3943]" />,
  warning: <AlertTriangle className="w-4 h-4 text-[#F7A600]" />,
  info: <Info className="w-4 h-4 text-[#3B82F6]" />,
};

const COLORS = {
  success: 'border-[rgba(22,199,132,0.3)] bg-[rgba(22,199,132,0.05)]',
  error: 'border-[rgba(234,57,67,0.3)] bg-[rgba(234,57,67,0.05)]',
  warning: 'border-[rgba(247,166,0,0.3)] bg-[rgba(247,166,0,0.05)]',
  info: 'border-[rgba(59,130,246,0.3)] bg-[rgba(59,130,246,0.05)]',
};

function Toast({ notification }) {
  const removeNotification = useUIStore((s) => s.removeNotification);

  useEffect(() => {
    const timer = setTimeout(() => removeNotification(notification.id), 5000);
    return () => clearTimeout(timer);
  }, [notification.id, removeNotification]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      className={`glass-panel rounded-xl p-4 border ${COLORS[notification.type]} flex items-start gap-3 max-w-sm shadow-xl`}
    >
      {ICONS[notification.type]}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{notification.title}</p>
        <p className="text-xs text-[#B1B5C3] mt-0.5">{notification.message}</p>
      </div>
      <button
        onClick={() => removeNotification(notification.id)}
        className="text-[#B1B5C3] hover:text-white flex-shrink-0 mt-0.5"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

export default function NotificationToast() {
  const notifications = useUIStore((s) => s.notifications);
  const recent = notifications.slice(0, 3);

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 z-[200] flex flex-col gap-2">
      <AnimatePresence>
        {recent.map((n) => (
          <Toast key={n.id} notification={n} />
        ))}
      </AnimatePresence>
    </div>
  );
}
