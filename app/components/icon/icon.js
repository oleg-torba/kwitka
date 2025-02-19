"use client";
import { FaBell } from "react-icons/fa";
import { useNotifications } from "../notifications/notifications";

const NotificationIcon = () => {
  const { notifications } = useNotifications();

  return (
    <div className="relative">
      <FaBell className="text-xl cursor-pointer" />
      {notifications.length > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          {notifications.length}
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
