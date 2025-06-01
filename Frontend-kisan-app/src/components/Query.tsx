import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const API_BASE_URL =
  import.meta.env.REACT_APP_API_URL || "http://localhost:3000";

interface ChatMessage {
  sender: "user" | "bot";
  message: string;
}

const Query: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      toast.error("Authentication token missing. Please log in.");
      navigate("/login");
    } else {
      setToken(storedToken);
    }
  }, [navigate]);

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message.");
      return;
    }

    if (!token) {
      toast.error("Authentication token missing. Please log in.");
      navigate("/login");
      return;
    }

    setChatHistory((prev) => [...prev, { sender: "user", message }]);
    setIsLoading(true);

    try {
      const payload = {
        user_id: "kumashravan5@gmail.com",
        agent_id: "683b58dbcf9fc42b59e136bc",
        session_id: "683b58dbcf9fc42b59e136bc-wezaj0hdgkc",
        message,
      };

      const res = await axios.post<{ response: string }>(
        `${API_BASE_URL}/api/inference/v3/inference/chat`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", message: res.data.response },
      ]);
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to get response.";
      toast.error(errMsg);
      setChatHistory((prev) => [...prev, { sender: "bot", message: errMsg }]);
    } finally {
      setIsLoading(false);
      setMessage("");
    }
  };

  const renderBotMessage = (message: string) => {
    try {
      const parsed = JSON.parse(message);
      if (Array.isArray(parsed)) {
        if (!parsed.length) return <p>No results.</p>;
        const headers = Object.keys(parsed[0]);

        return (
          <div className="overflow-auto">
            <table className="min-w-full border text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  {headers.map((h) => (
                    <th key={h} className="px-3 py-2 border-b">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsed.map((row: any, i: number) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    {headers.map((h) => (
                      <td key={h} className="px-3 py-2">
                        {row[h]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      if (typeof parsed === "object") {
        return (
          <div className="space-y-1 text-sm">
            {Object.entries(parsed).map(([key, val]) => (
              <div key={key} className="flex justify-between">
                <span className="font-semibold">{key}</span>
                <span>{String(val)}</span>
              </div>
            ))}
          </div>
        );
      }

      return <pre>{parsed}</pre>;
    } catch {
      return <pre>{message}</pre>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-bold">Chat Assistant</h1>
      </div>

      {/* Chat History */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {chatHistory.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            Hello! Ask your questions below.
          </p>
        )}

        {chatHistory.map((chat, i) => (
          <div
            key={i}
            className={`flex ${
              chat.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg whitespace-pre-wrap ${
                chat.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800 border border-gray-200"
              }`}
            >
              {chat.sender === "bot"
                ? renderBotMessage(chat.message)
                : chat.message}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-lg border text-gray-600">
              Processing...
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4 flex items-center gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          disabled={isLoading}
          onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSubmit()}
        />
        <Button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white"
          disabled={isLoading || !message.trim()}
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default Query;
