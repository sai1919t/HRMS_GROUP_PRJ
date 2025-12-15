import React, { useState, useEffect } from 'react'
import io from "socket.io-client";
import axios from "axios";

const socket = io.connect("http://localhost:3000");

const Chat = () => {
  const [recentChats, setRecentChats] = useState([]); // Recent conversations
  const [allUsers, setAllUsers] = useState([]); // All users for search
  const [displayedContacts, setDisplayedContacts] = useState([]); // What is actually shown
  const [searchQuery, setSearchQuery] = useState(""); // Search input state

  // Initial dummy data for conversation
  const [selectedChat, setSelectedChat] = useState(null);
  const [inputMessage, setInputMessage] = useState('')
  const [chatListOpen, setChatListOpen] = useState(true)
  const [currentUser, setCurrentUser] = useState(null);

  // Conversation state for the active chat window
  const [conversation, setConversation] = useState([]);

  // Fetch Data on Load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        let currentUserId = null;
        if (userStr) {
          const parsed = JSON.parse(userStr);
          setCurrentUser(parsed);
          currentUserId = parsed.id;
        }

        if (!token || !currentUserId) {
          console.warn("Chat: Missing token or user ID");
          return;
        }

        // Fetch Recent Chats
        try {
          const recentRes = await axios.get(`http://localhost:3000/api/chats/${currentUserId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          // Transform Recent
          const recent = recentRes.data.map(user => ({
            id: user.id,
            name: user.name,
            role: user.role,
            message: user.message,
            time: user.time ? new Date(user.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
            avatar: user.name ? user.name.charAt(0).toUpperCase() : "?",
            unread: false,
            status: "offline"
          }));

          setRecentChats(recent);
          setDisplayedContacts(recent); // Default view
          if (recent.length > 0) setSelectedChat(recent[0].id);

        } catch (error) {
          console.error("Error fetching recent chats:", error);
        }

        // Fetch All Users (for search)
        const usersRes = await axios.get("http://localhost:3000/api/users", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const all = (usersRes.data.users || [])
          .filter(u => u.id !== currentUserId)
          .map(user => ({
            id: user.id,
            name: user.fullname,
            role: user.email,
            message: "Start a new conversation", // generic message
            time: "",
            avatar: user.fullname ? user.fullname.charAt(0).toUpperCase() : "?",
            unread: false,
            status: "offline"
          }));
        setAllUsers(all);

      } catch (err) {
        console.error("Failed to fetch chat data", err);
      }
    };
    fetchData();
  }, []);

  // Handle Search vs Recent View
  useEffect(() => {
    if (!searchQuery.trim()) {
      setDisplayedContacts(recentChats);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = allUsers.filter(contact =>
        contact.name.toLowerCase().includes(lowerQuery) ||
        contact.role.toLowerCase().includes(lowerQuery)
      );
      setDisplayedContacts(filtered);
    }
  }, [searchQuery, recentChats, allUsers]);

  // Fetch Chat History when selectedChat changes
  useEffect(() => {
    const fetchHistory = async () => {
      if (!selectedChat || !currentUser) return;

      // Clear unread status in recent list
      setRecentChats(prev => prev.map(c =>
        c.id === selectedChat ? { ...c, unread: false } : c
      ));

      try {
        const res = await axios.get(`http://localhost:3000/api/messages/${currentUser.id}/${selectedChat}`);
        const history = res.data.map(msg => ({
          id: msg.id,
          text: msg.message,
          sender: msg.sender_id === currentUser.id ? "me" : "other",
          time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        setConversation(history);
      } catch (err) {
        console.error("Failed to fetch chat history", err);
      }
    };
    fetchHistory();
  }, [selectedChat, currentUser]);

  const selectedChatData = displayedContacts.find(m => m.id === selectedChat) || allUsers.find(u => u.id === selectedChat);

  // Listen for incoming messages
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      // Reorder contacts: Move sender to top & set unread
      setRecentChats(prev => {
        const senderId = data.senderId === currentUser?.id ? data.receiverId : data.senderId;
        const senderIndex = prev.findIndex(c => c.id === senderId);

        let updatedContacts = [...prev];
        let sender;

        if (senderIndex !== -1) {
          // User already in recent list
          [sender] = updatedContacts.splice(senderIndex, 1);
        } else {
          // User not in recent list - find in allUsers or create placeholder
          const userDetails = allUsers.find(u => u.id === senderId);
          if (!userDetails) return prev; // Should be rare
          sender = { ...userDetails };
        }

        // Update unread status only if not currently chatting with them
        const isUnread = senderId !== selectedChat;

        updatedContacts.unshift({
          ...sender,
          unread: isUnread || sender.unread,
          message: data.message,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        return updatedContacts;
      });

      // Update active conversation if applicable
      if (
        (data.senderId === selectedChat && data.receiverId === currentUser?.id) ||
        (data.senderId === currentUser?.id && data.receiverId === selectedChat)
      ) {
        setConversation((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: data.message,
            sender: data.senderId === currentUser?.id ? "me" : "other",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    };

    socket.off("receive_message").on("receive_message", handleReceiveMessage);

    // Cleanup listener on unmount/dep change to avoid duplicates
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };

  }, [socket, selectedChat, currentUser, allUsers]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() && currentUser && selectedChat) {
      const messageData = {
        room: selectedChat,
        senderId: currentUser.id,
        receiverId: selectedChat,
        author: currentUser.fullname,
        message: inputMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      await socket.emit("send_message", messageData);

      // Optimistic update: Add to conversation AND reorder contacts list
      setConversation((prev) => [
        ...prev,
        { id: Date.now(), text: inputMessage, sender: "me", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);

      // Move receiver to top in contacts list
      setRecentChats(prev => {
        const receiverIndex = prev.findIndex(c => c.id === selectedChat);
        let updatedContacts = [...prev];
        let receiver;

        if (receiverIndex !== -1) {
          [receiver] = updatedContacts.splice(receiverIndex, 1);
        } else {
          const userDetails = allUsers.find(u => u.id === selectedChat);
          if (!userDetails) return prev;
          receiver = { ...userDetails };
        }

        updatedContacts.unshift({
          ...receiver,
          message: "You: " + inputMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        return updatedContacts;
      });

      setInputMessage('')
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Chat List Sidebar */}
      <div className={`${chatListOpen ? 'block' : 'hidden'} md:block w-full md:w-80 bg-white border-r border-gray-200 overflow-y-auto`}>
        {/* Messages Header */}
        <div className="p-4 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Messages</h2>
            <button
              onClick={() => setChatListOpen(false)}
              className="md:hidden text-gray-600"
            >
              <svg className="w-6 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-center bg-blue-50 rounded-lg px-3 py-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Employees..."
              className="bg-transparent ml-2 w-full text-sm outline-none text-gray-600 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="divide-y divide-gray-100">
          {displayedContacts.map((msg) => (
            <button
              key={msg.id}
              onClick={() => {
                setSelectedChat(msg.id)
                setChatListOpen(false)
              }}
              className={`w-full p-2.5 text-left transition-colors ${selectedChat === msg.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-2.5">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-semibold shrink-0 text-sm">
                  {msg.avatar}
                </div>

                {/* Message Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`font-semibold truncate text-sm ${msg.unread ? 'text-black font-bold' : 'text-gray-800'}`}>{msg.name}</h3>
                    {msg.status === 'online' && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0"></div>
                    )}
                  </div>
                  <p className={`text-xs truncate ${msg.unread ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>{msg.message || msg.role}</p>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs text-gray-500">{msg.time}</p>
                    {msg.unread && (
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
          {displayedContacts.length === 0 && (
            <div className="p-4 text-center text-gray-500 text-sm">
              {searchQuery ? `No employees found matching "${searchQuery}"` : "Search for employees to start a chat"}
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`${chatListOpen ? 'hidden' : 'flex'} md:flex flex-1 flex-col bg-white`}>
        {/* Chat Header */}
        <div className="border-b border-gray-200 p-3 md:p-4 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <button
              onClick={() => setChatListOpen(true)}
              className="md:hidden text-gray-600 shrink-0"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-linear-to-br from-gray-400 to-gray-600 text-white flex items-center justify-center font-semibold shrink-0 text-sm md:text-base">
              {selectedChatData?.avatar}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-800 truncate text-sm md:text-base">{selectedChatData?.name}</h3>
              <p className="text-xs md:text-sm text-gray-500 truncate">{selectedChatData?.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <button className="text-gray-600 hover:text-gray-800 p-1 md:p-2">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="text-gray-600 hover:text-gray-800 p-1 md:p-2 hidden sm:block">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button className="text-gray-600 hover:text-gray-800 p-1 md:p-2">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {conversation.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`${msg.sender === "me" ? "bg-blue-300" : "bg-gray-200"} text-gray-800 rounded-lg px-3 md:px-4 py-2 max-w-xs md:max-w-md`}>
                <p className="text-sm">{msg.text}</p>
                <p className="text-[10px] text-gray-500 mt-1 text-right">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-3 md:p-4 bg-blue-50">
          <div className="flex items-center gap-2 md:gap-3">
            <button className="text-blue-500 hover:text-blue-600 shrink-0 p-1">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
              </svg>
            </button>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="What would you like to say?"
              className="flex-1 bg-white border border-gray-300 rounded-lg px-3 md:px-4 py-2 text-xs md:text-sm outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="text-gray-600 hover:text-gray-800 shrink-0 p-1"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.9702544,11.6889879 22.9702544,11.6889879 22.9702544,11.6889879 L4.13399899,1.16151493 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.837654326,3.0486314 1.15159189,3.98722579 L3.03521743,10.4282188 C3.03521743,10.5853161 3.19218622,10.7424135 3.50612381,10.7424135 L16.6915026,11.5279004 C16.6915026,11.5279004 17.1624089,11.5279004 17.1624089,12.0991925 C17.1624089,12.6704847 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat