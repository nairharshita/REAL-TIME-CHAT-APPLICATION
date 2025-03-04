import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";

const Chat = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!username) navigate("/");

    socket.on("chatMessage", (msg) => {
      console.log("📩 New Message Received:", msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("chatMessage");
    };
  }, [navigate, username]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chatMessage", { username, message });
      setMessage("");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6">
      <h1 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">💬 Live Chat</h1>

      <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl flex flex-col h-[500px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-100 rounded-t-2xl max-h-[400px]">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.username === username ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 max-w-xs rounded-lg shadow-md text-sm ${msg.username === username ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-200 text-gray-800 rounded-bl-none"}`}>
                <strong className="text-xs block mb-1 text-gray-300">{msg.username}</strong>
                {msg.message}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className="flex border-t p-3 bg-white rounded-b-2xl">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-3 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-r-full hover:bg-blue-600 transition-all duration-300">
            ➤
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
