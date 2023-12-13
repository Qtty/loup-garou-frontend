import React, { useState, useEffect } from 'react';
import "./ChatBox.css";
import { sendMessageUtil } from './sendMessage';


// Define the shape of the props using an interface
interface ChatBoxProps {
  playerAddress: string;
}

// Define the shape of a message
interface Message {
  id: number;
  sender: string;
  message: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ playerAddress}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [address] = useState<string>(playerAddress); // Replace with actual player address
  const chatId = '1341';
  const api = "http://192.168.1.6:5000";


  // Function to fetch messages
  const fetchMessages = async () => {
    try {
      const response = await fetch(`${api}/get_messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ chat_id: chatId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const newMessages: Message[] = await response.json();
      
      const existingMessageIds = new Set();
      for (let i = 0; i < messages.length; i++) {
        existingMessageIds.add(messages[i].id);
      }
      // Filter out messages that are already present in the state
      const uniqueMessages = newMessages.filter(newMsg => !existingMessageIds.has(newMsg.id));

      if (uniqueMessages.length != 0) {
        console.log('entered');
        console.log(uniqueMessages);
        console.log(existingMessageIds.entries());
        setMessages(prevMessages => [...prevMessages, ...uniqueMessages]);
      }
      
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchMessages();
    }, 1000);

    return () => clearInterval(intervalId);
  },  [messages.length]);

  const handleNewMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newMessage.trim()) return;

    await sendMessageUtil(chatId, address, newMessage);
    setNewMessage('');
  };

  return (
    <div className="chat-box column is-one-quarter" style={{ height: '100vh', position: 'fixed', right: 0, top: 0, }}>
  <div className="box" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <div className="messages" style={{ overflowY: 'auto', flexGrow: 1 }}>
      {messages.map((message, index) => (
        <div key={index} className="message">
          <strong>{message.sender.slice(0, 10)}:</strong> {message.message}
        </div>
      ))}
    </div>
    <div className="field has-addons">
      <div className="control is-expanded">
        <input
          className="input"
          type="text"
          value={newMessage}
          onChange={handleNewMessageChange}
          placeholder="Type a message..."
        />
      </div>
      <div className="control">
        <button className="button is-info" onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  </div>
</div>

  );
};

export default ChatBox;
