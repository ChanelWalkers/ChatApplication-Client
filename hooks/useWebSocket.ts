import { websocketService } from "@/services/websocket.service";
import { useEffect, useRef, useState } from "react";

export const useWebSocket = (onMessage?: (message: any) => void) => {
  const [connected, setConnected] = useState(false);
  const onMessageRef = useRef(onMessage);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    websocketService.connect(token, () => {
      setConnected(true);

      subscriptionRef.current = websocketService.subscribe(
        "/user/queue/messages",
        (message) => onMessageRef.current?.(message),
      );
    });

    return () => {
      subscriptionRef.current?.unsubscribe();
      websocketService.disconnect();
      setConnected(false);
    };
  }, []);
};
