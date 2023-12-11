import React, { useState, useEffect } from 'react';
import "./ChatBox.css";


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
  const [address, setAddress] = useState<string>(playerAddress); // Replace with actual player address
  const chatId = '1341';

  // Function to send a message
  const sendMessage = async (messageText: string): Promise<void> => {
    try {
      const response = await fetch('http://localhost:5000/send_message', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         },
        mode: 'cors',
        body: JSON.stringify({
          chat_id: chatId,
          name: address,
          message: messageText,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log('Message sent successfully');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Function to fetch messages
  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:5000/get_messages', {
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

    await sendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <div className="chat-box column is-one-quarter" style={{ height: '100vh', position: 'fixed', right: 0, top: 0, }}>
  <div className="box" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <div className="messages" style={{ overflowY: 'auto', flexGrow: 1 }}>
      {messages.map((message, index) => (
        <div key={index} className="message has-background-grey-lighter">
          <strong>{message.sender}:</strong> {message.message}
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
