import React, { useState } from 'react';
import axios from 'axios';
const Page = () => {
  const [chatLog, setChatLog] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const sendMessage = async (message) => {
    try {
      const url = "https://api.openai.com/v1/chat/completions";
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      };
      const data = {
        model: "gpt-3.5-turbo-1106",
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      };
      setLoading(true);
      const response = await axios.post(url, data, { headers });
      setChatLog((prev) => [
        ...prev,
        { type: "bot", message: response.data.choices[0].message.content },
      ]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setChatLog((prev) => [...prev, { type: "user", message: inputValue }]);
    sendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div className="flex flex-col h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-center">Chat</h1>

      <div className="flex-1 overflow-y-auto p-4 bg-white rounded-lg shadow-sm">
        {chatLog.map((message, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded-lg ${
              message.type === "user"
                ? "bg-blue-500 text-white text-right"
                : "bg-gray-200 text-left"
            }`}
          >
            {message.type === "user" ? "You: " : ""}
            {message.message}
          </div>
        ))}

        {loading && <div className="text-gray-500 text-center">Loading...</div>}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="ml-4 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Page;