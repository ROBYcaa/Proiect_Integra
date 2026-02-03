import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;

const SOCKET_URL = "http://10.3.0.179:8080/chat";

export const connectWebSocket = (onMessageReceived, onReadReceived) => {
    stompClient = new Client({
        webSocketFactory: () => new SockJS(SOCKET_URL),
        reconnectDelay: 5000,

        onConnect: () => {
            console.log("WebSocket connected (mobile)");

            stompClient.subscribe("/topic/messages", (message) => {
                onMessageReceived(JSON.parse(message.body));
            });

            stompClient.subscribe("/topic/read", (message) => {
                onReadReceived(JSON.parse(message.body));
            });
        },
    });

    stompClient.activate();
};

export const sendMessageWS = (message) => {
    if (stompClient && stompClient.connected) {
        stompClient.publish({
            destination: "/app/send",
            body: JSON.stringify(message),
        });
    }
};

export const sendReadWS = (senderId, receiverId) => {
    if (stompClient && stompClient.connected) {
        stompClient.publish({
            destination: "/app/read",
            body: JSON.stringify({ senderId, receiverId }),
        });
    }
};

