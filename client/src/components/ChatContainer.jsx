import { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import moment from "moment";

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessagesForSelectedUser } = useContext(ChatContext);
  const { authUser } = useContext(AuthContext);
  const chatRef = useRef();
  const [text, setText] = useState("");

  const handleMessageSend = async () => {
    if (text && text.length > 0) {
      await sendMessage({ text });
      setText("");
    }

  }

  const handleCloseChat = () => {
    setSelectedUser(null)
  }

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    getMessagesForSelectedUser(selectedUser?._id)
  }, [selectedUser])

  if (!selectedUser) {
    return (
      <div className="flex flex-col w-[100%] justify-center items-center h-full bg-zinc-950 text-zinc-300">
        <p className="text-xl">Select a user to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-[100%] h-full bg-zinc-950 text-white">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-zinc-500 px-4 py-3 bg-zinc-900">
        <div className="flex items-center gap-3">
          <img
            src={selectedUser.profilePicture || "/default-avatar.png"}
            alt={selectedUser.fullname}
            className="w-10 h-10 rounded-full object-cover border border-zinc-700"
          />
          <div>
            <h2 className="text-md font-medium">{selectedUser.fullname}</h2>
          </div>
        </div>
        <div 
          onClick={() => handleCloseChat()}
          className="hover:cursor-pointer hover:bg-zinc-700 border-2 border-white rounded-xl px-2 py-1">
          X Close Chat
        </div>
      </div>

      {/* Messages */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-zinc-950"
      >
        {messages.map((msg) => {
          const isSender = msg.senderId === authUser._id;
          return (
            <div
              key={msg._id}
              className={`flex w-full ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs md:max-w-sm lg:max-w-md px-4 py-2 rounded-2xl shadow-md
            ${isSender
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-zinc-800 text-white rounded-bl-none"
                  }`}
              >
                <p className="break-words">{msg.text}</p>
                <span className="text-xs text-zinc-300 mt-1 block text-right">
                  {moment(msg.createdAt).format("hh:mm A")}
                </span>
              </div>
            </div>
          );
        })}
      </div>


      {/* Optional: Typing or Message Input */}
      {/* <MessageInput /> */}

      <div className="flex items-center justify-center w-full min-h-15 border-t-2 border-l-2 border-zinc-500">
        <textarea
          type="text"
          className="px-5 text-start w-full h-full outline-none border-none"
          placeholder="type message..."
          onChange={(e) => setText(e.target.value)}
          value={text}
          required
        />
        <button
          onClick={handleMessageSend}
          className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition hover:cursor-pointer"
        >
          {/* Send Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-5 h-5 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 4.5l16.5 7.5-16.5 7.5 3.75-7.5-3.75-7.5z"
            />
          </svg>
        </button>

      </div>

    </div>
  );
};

export default ChatContainer;
