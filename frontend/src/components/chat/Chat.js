import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getChatHistory } from "../../api/api";
import { connectWebSocket, sendMessageWS, disconnectWebSocket } from "../../api/websocket";
import "./Chat.css";

function Chat() {
    const { otherUserId } = useParams();
    const [currentUserId, setCurrentUserId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const routerLocation = useLocation();

    const otherUserName = routerLocation.state?.otherUserName || "User";
    const messagesEndRef = useRef(null);
    const otherUserIdRef = useRef(null);

    useEffect(() => {
        otherUserIdRef.current = otherUserId;
    }, [otherUserId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const userId = localStorage.getItem("currentUserId");
        setCurrentUserId(userId);
    }, []);

    useEffect(() => {
        if (!currentUserId) return;

        connectWebSocket((newMessage) => {
            const otherId = otherUserIdRef.current;

            if (
                (newMessage.senderId === currentUserId &&
                    newMessage.receiverId === otherId) ||
                (newMessage.senderId === otherId &&
                    newMessage.receiverId === currentUserId)
            ) {
                setMessages(prev => [...prev, newMessage]);
            }
        });

        return () => {
            disconnectWebSocket();
        };
    }, [currentUserId]);



    useEffect(() => {
        if (!currentUserId || !otherUserId) return;

        const loadHistory = async () => {
            const history = await getChatHistory(currentUserId, otherUserId);
            console.log(currentUserId,otherUserId)
            setMessages(history);
            console.log(history)
        };

        loadHistory();
    }, [currentUserId, otherUserId]);


    const handleSend = () => {
        if (text.trim() === "") return;

        sendMessageWS({
            senderId: currentUserId,
            receiverId: otherUserId,
            text: text
        });

        setText("");
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>Chat cu {otherUserName}</h2>
            </div>

            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div
                        key={msg.id || index}
                        className={
                            msg.senderId === currentUserId
                                ? "message own"
                                : "message other"
                        }
                    >
                        <div>{msg.text}</div>
                        <div className="message-time">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef}/>

            </div>

            <div className="chat-input">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Scrie mesaj..."
                />
                <button onClick={handleSend}>Trimite</button>
            </div>
        </div>
    );
}

export default Chat;
