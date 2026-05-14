import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MovieRecommendationChat({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [conversationHistory, setConversationHistory] = useState([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!userInput.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      role: "user",
      content: userInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const newUserInput = userInput.trim();
    setUserInput("");
    setIsLoading(true);

    try {
      // Send with conversation history for context
      const response = await fetch(`/api/ai/movie-recommendations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput: newUserInput,
          conversationHistory: conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      // Update conversation history
      const updatedHistory = [
        ...conversationHistory,
        { role: "user", content: newUserInput },
        { role: "assistant", content: data.response },
      ];
      setConversationHistory(updatedHistory);

      // Add AI response message
      const aiMessage = {
        id: messages.length + 2,
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        recommendations: data.recommendations,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error:", error);

      const errorMessage = {
        id: messages.length + 2,
        role: "assistant",
        content: "Oops! Try again?",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Blurry Background Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-30 bg-black/20 transition-opacity duration-300"
      />

      {/* Chat Panel */}
      <div className="fixed bottom-6 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] bg-charcoal/30 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
        {/* Header - Creative Design */}
        <div className="px-5 py-4 border-b border-white/10 bg-gradient-to-r from-accent/20 via-transparent to-accent/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
                <span className="text-base">🎬</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">CinéMate</h3>
                <p className="text-[10px] text-white/40">AI Movie Guide</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="material-symbols-outlined text-white/40 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full transition-all text-sm"
              type="button"
              title="Close">
              close
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 p-4 max-h-96">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom`}>
              <div
                className={`max-w-xs rounded-2xl px-3.5 py-2.5 text-xs ${
                  msg.role === "user"
                    ? "bg-accent/90 text-charcoal font-semibold"
                    : "bg-white/10 backdrop-blur-sm border border-white/10 text-white/95"
                }`}>
                <p className="whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </p>

                {/* Event Recommendations */}
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
                    {msg.recommendations.map((event) => (
                      <div
                        key={event._id || event.id}
                        className="flex gap-3 p-2 border border-white/15 rounded-lg hover:bg-white/5 transition">
                        {/* Event Poster */}
                        <div className="w-16 h-24 flex-shrink-0 overflow-hidden rounded bg-charcoal/50">
                          {event.poster ? (
                            <img
                              src={event.poster}
                              alt={event.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-white/5">
                              <span className="text-lg">🎬</span>
                            </div>
                          )}
                        </div>

                        {/* Event Info */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-semibold text-white text-sm line-clamp-2">
                              {event.title}
                            </h4>

                            {/* Custom Description */}
                            {event.description && (
                              <p className="mt-1.5 text-xs text-white/70 line-clamp-3 leading-tight">
                                {event.description}
                              </p>
                            )}

                            {/* Pricing Info */}
                            {event.pricing && (
                              <div className="mt-1.5 text-xs text-white/60">
                                {event.pricing.isFree ? (
                                  <p className="text-accent font-semibold">
                                    🎉 FREE EVENT
                                  </p>
                                ) : event.pricing.singlePrice ? (
                                  <p className="font-medium text-accent">
                                    {event.pricing.singlePrice}{" "}
                                    {event.pricing.currency}
                                  </p>
                                ) : event.pricing.categories &&
                                  Object.keys(event.pricing.categories).length >
                                    0 ? (
                                  <div className="space-y-0.5">
                                    {Object.entries(event.pricing.categories)
                                      .slice(0, 2)
                                      .map(([cat, price]) => (
                                        <p key={cat} className="text-white/70">
                                          {cat}:{" "}
                                          <span className="text-accent font-medium">
                                            {price} {event.pricing.currency}
                                          </span>
                                        </p>
                                      ))}
                                    {Object.keys(event.pricing.categories)
                                      .length > 2 && (
                                      <p className="text-white/40 text-xs">
                                        +
                                        {Object.keys(event.pricing.categories)
                                          .length - 2}{" "}
                                        more
                                      </p>
                                    )}
                                  </div>
                                ) : null}
                              </div>
                            )}
                          </div>

                          {/* Book Button */}
                          <button
                            onClick={() => {
                              onClose();
                              navigate(`/events/${event._id || event.id}`);
                            }}
                            className="self-start mt-2 px-3 py-1 bg-accent hover:bg-accent/90 text-charcoal text-xs font-bold rounded transition">
                            Book
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-in fade-in">
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 text-white/75 rounded-2xl px-3.5 py-2.5">
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.1s]"></span>
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSendMessage}
          className="border-t border-white/10 p-4 bg-gradient-to-t from-charcoal/60 to-transparent space-y-2">
          <div className="flex gap-2 items-end">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="What vibe today?"
              disabled={isLoading}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-accent/50 focus:bg-white/10 resize-none transition-all"
              rows="1"
            />
            <button
              type="submit"
              disabled={isLoading || !userInput.trim()}
              className="bg-accent/90 hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed text-charcoal font-bold p-2 rounded-xl transition-all text-xs h-full w-10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">
                send
              </span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
