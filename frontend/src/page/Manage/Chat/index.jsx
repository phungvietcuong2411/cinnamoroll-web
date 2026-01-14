import { useEffect, useState, useRef, useCallback } from "react";
import Linkify from "linkify-react";
import { io } from "socket.io-client";
import {
  getAllConversationsForAdmin,
  getMessages,
  sendMessage,
} from "../../../services/chat.service";
import { MessageCircle, Send, Loader2, Clock, User } from "lucide-react";

const ADMIN_ID = 5;

const socket = io(import.meta.env.VITE_API_URL, {
  transports: ["websocket"],
  auth: {
    token: localStorage.getItem("token"),
  },
});

function Chat() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [pendingMsgId, setPendingMsgId] = useState(null);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const linkifyOptions = {
    target: "_blank",
    rel: "noopener noreferrer",
    className: "text-blue-300 underline break-all hover:text-blue-400"
  };

  // Socket connect
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("🟢 ADMIN socket connected:", socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Receive realtime message
  useEffect(() => {
    const handleReceive = (msg) => {
      console.log("📩 ADMIN received:", msg);

      const normalized = {
        ...msg,
        sender_id: Number(msg.sender_id),
        createdAt: msg.createdAt ? new Date(msg.createdAt) : new Date(),
      };

      setMessages((prev) => {
        if (pendingMsgId && normalized.sender_id === ADMIN_ID) {
          return prev.map((m) =>
            m.id === pendingMsgId ? { ...normalized, isSending: false } : m
          );
        }
        if (prev.some((m) => m.id === normalized.id)) return prev;
        return [...prev, normalized];
      });

      if (normalized.sender_id === ADMIN_ID) {
        setPendingMsgId(null);
      }

      scrollToBottom();
    };

    socket.on("receive_message", handleReceive);
    return () => socket.off("receive_message", handleReceive);
  }, [pendingMsgId]);

  // Join/Leave conversation room
  useEffect(() => {
    if (!selectedConversation?.id) return;

    socket.emit("join_conversation", selectedConversation.id);

    return () => {
      socket.emit("leave_conversation", selectedConversation.id);
    };
  }, [selectedConversation]);

  // Load all conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoadingConversations(true);
        const res = await getAllConversationsForAdmin();
        setConversations(res.data || []);
      } catch (err) {
        console.error("Lỗi tải danh sách hội thoại:", err);
      } finally {
        setLoadingConversations(false);
      }
    };

    fetchConversations();
  }, []);

  const selectConversation = async (conv) => {
    if (selectedConversation?.id === conv.id) return;

    setSelectedConversation(conv);
    setMessages([]);

    try {
      setLoadingMessages(true);
      const res = await getMessages(conv.id);

      setMessages(
        res.data.map((m) => ({
          ...m,
          sender_id: Number(m.sender_id),
          createdAt: m.createdAt ? new Date(m.createdAt) : null,
        }))
      );

      scrollToBottom();
    } catch (err) {
      console.error("Lỗi tải tin nhắn:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || !selectedConversation || sending) return;

    setSending(true);

    const tempId = Date.now();
    const optimisticMsg = {
      id: tempId,
      content: trimmed,
      sender_id: ADMIN_ID,
      createdAt: new Date(),
      isSending: true,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setPendingMsgId(tempId);
    setText("");
    scrollToBottom();

    try {
      await sendMessage({
        conversationId: selectedConversation.id,
        content: trimmed,
      });
    } catch (err) {
      console.error("Gửi tin nhắn thất bại:", err);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setText(trimmed);
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  useEffect(() => {
    if (selectedConversation && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedConversation]);

  // Loading skeleton for conversations
  const ConversationSkeleton = () => (
    <div className="px-4 py-4 border-b animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  return (
    <div className="h-screen bg-gray-200 font-futura-regular flex justify-between">

      {/* Sidebar - Conversations List */}
      <div className="w-[19%] bg-gray-50 flex flex-col">
        <div className="p-5 border-b bg-white">
          <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
            <User size={20} className="text-blue-600" />
            Hội thoại
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingConversations ? (
            <>
              <ConversationSkeleton />
              <ConversationSkeleton />
              <ConversationSkeleton />
              <ConversationSkeleton />
            </>
          ) : conversations.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              Chưa có hội thoại nào
            </div>
          ) : (
            conversations.map((conv) => {
              const isSelected = selectedConversation?.id === conv.id;
              const lastMsg = conv.last_message; // giả sử backend trả về trường này

              return (
                <button
                  key={conv.id}
                  onClick={() => selectConversation(conv)}
                  className={`
                        w-full text-left px-5 py-4 border-b transition-all duration-150
                        hover:bg-gray-100
                        ${isSelected ? "bg-blue-50 border-l-4 border-l-blue-600" : ""}
                      `}
                >
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-700 font-bold text-xl mr-4 shadow">
                      {conv.name?.[0]?.toUpperCase() || "K"}
                    </div>
                    <div className="font-medium text-gray-900">
                      {conv.name || `Khách hàng #${conv.user_id || conv.id}`}
                    </div>

                    {conv.unread_count > 0 && (
                      <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>

                  {lastMsg && (
                    <div className="mt-1 text-sm text-gray-500 flex items-center gap-1.5">
                      <Clock size={14} />
                      <span className="truncate max-w-[220px]">
                        {lastMsg.content}
                      </span>
                      <span className="text-xs text-gray-400 ml-auto">
                        {new Date(lastMsg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col bg-gray-50 w-[80%]">
        {/* Header */}
        {selectedConversation ? (
          <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-6 py-4 flex items-center shadow-sm">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-700 font-bold text-xl mr-4 shadow">
              {selectedConversation.name?.[0]?.toUpperCase() || "K"}
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {selectedConversation.name || "Khách hàng"}
              </h3>
              <p className="text-sm opacity-90 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Đang hoạt động
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-100">
            <div className="text-center">
              <MessageCircle size={64} className="mx-auto mb-4 opacity-40" />
              <p className="text-xl">Chọn một hội thoại để bắt đầu</p>
            </div>
          </div>
        )}

        {/* Messages */}
        {selectedConversation && (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-gray-50">
              {loadingMessages ? (
                <div className="text-center text-gray-500 mt-20">
                  <Loader2 className="animate-spin mx-auto mb-3" size={32} />
                  Đang tải tin nhắn...
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender_id === ADMIN_ID;
                  const time = msg.createdAt?.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"} animate-fade-in`}
                    >
                      <div
                        className={`
                              max-w-[70%] px-5 py-3 rounded-2xl shadow-md relative
                              break-words whitespace-pre-wrap
                              ${isMe
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-white text-gray-900 rounded-bl-none border border-gray-200"
                          }
                            `}
                      >
                        <Linkify options={linkifyOptions}>
                          {msg.content}
                        </Linkify>

                        {msg.isSending && (
                          <Loader2
                            size={16}
                            className="absolute -bottom-2 -right-2 text-white animate-spin"
                          />
                        )}

                        <span
                          className={`text-xs mt-2 block opacity-75 text-right ${isMe ? "text-blue-100" : "text-gray-500"
                            }`}
                        >
                          {time}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t flex items-center gap-3">
              <input
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Nhập tin nhắn..."
                className="flex-1 bg-gray-100 rounded-full px-6 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
                disabled={sending}
              />
              <button
                onClick={handleSend}
                disabled={sending || !text.trim()}
                className={`
                      p-3.5 rounded-full transition-all duration-200 min-w-[52px] flex items-center justify-center
                      ${sending || !text.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-md"
                  }
                    `}
              >
                {sending ? (
                  <Loader2 size={22} className="animate-spin" />
                ) : (
                  <Send size={22} />
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Chat;


