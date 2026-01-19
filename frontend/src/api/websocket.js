import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;

export const connectWebSocket = (onMessageReceived) => {
    stompClient = new Client({
        webSocketFactory: () =>
            new SockJS("http://localhost:8080/chat"),
        reconnectDelay: 5000,

        onConnect: () => {
            console.log("WebSocket connected");

            stompClient.subscribe("/topic/messages", (message) => {
                const parsedMessage = JSON.parse(message.body);
                onMessageReceived(parsedMessage);
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
