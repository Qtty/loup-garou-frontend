const api = "http://192.168.1.6:5000"; // API endpoint

export const sendMessageUtil = async (chatId: string, playerAddress: string, messageText: string) => {
  try {
    const response = await fetch(`${api}/send_message`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      mode: 'cors',
      body: JSON.stringify({
        chat_id: chatId,
        name: playerAddress,
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
