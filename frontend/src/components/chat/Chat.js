import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getChatHistory } from "../../api/api";
import { connectWebSocket, sendMessageWS } from "../../api/websocket";
import "./Chat.css";

function Chat() {
    const { otherUserId } = useParams();
    const [currentUserId, setCurrentUserId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const routerLocation = useLocation();

    const otherUserName = routerLocation.state?.otherUserName || "User";

    useEffect(() => {
        const userId = localStorage.getItem("currentUserId");
        setCurrentUserId(userId);
    }, []);

    useEffect(() => {
        if (!currentUserId || !otherUserId) return;

        const loadHistory = async () => {
            const history = await getChatHistory(currentUserId, otherUserId);
            setMessages(history);
        };

        loadHistory();

        connectWebSocket((newMessage) => {
            if (
                (newMessage.senderId === currentUserId &&
                    newMessage.receiverId === otherUserId) ||
                (newMessage.senderId === otherUserId &&
                    newMessage.receiverId === currentUserId)
            ) {
                setMessages(prev => [...prev, newMessage]);
            }
        });

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
                {messages.map((msg) => (
                    <div
                        key={msg.id || Math.random()}
                        className={
                            msg.senderId === currentUserId
                                ? "message own"
                                : "message other"
                        }
                    >
                        {msg.text}
                    </div>
                ))}
            </div>

            <div className="chat-input">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Scrie mesaj..."
                />
                <button onClick={handleSend}>Trimite</button>
            </div>
        </div>
    );
}

export default Chat;
