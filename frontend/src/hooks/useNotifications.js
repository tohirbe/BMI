import { useState, useEffect, useCallback } from "react";
import { useSelector }                       from "react-redux";
import { notifications as notifApi }         from "../api";
import { selectUser }                        from "../store/authSlice";

export function useNotifications() {
  const user          = useSelector(selectUser);
  const [count, setCount] = useState(0);

  const fetchCount = useCallback(() => {
    if (!user) return;
    notifApi.unreadCount()
      .then((res) => setCount(res.data.data?.count ?? 0))
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 30_000);
    return () => clearInterval(interval);
  }, [fetchCount]);

  const markRead = async (id) => {
    await notifApi.markRead(id);
    fetchCount();
  };

  return { unreadCount: count, refresh: fetchCount, markRead };
}