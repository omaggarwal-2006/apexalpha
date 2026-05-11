import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationService } from "@/services/NotificationService";

/**
 * Hook for real-time user notifications
 */
export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = NotificationService.subscribe(user.uid, (data) => {
      setNotifications(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { notifications, loading };
};
