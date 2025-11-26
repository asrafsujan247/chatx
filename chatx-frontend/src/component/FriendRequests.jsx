import { useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { UserCheck, UserX, Clock, X } from "lucide-react";
import toast from "react-hot-toast";

export const FriendRequests = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("received");
  const {
    pendingRequests,
    sentRequests,
    getPendingRequests,
    getSentRequests,
    respondToRequest,
  } = useChatStore();

  useEffect(() => {
    getPendingRequests();
    getSentRequests();
  }, [getPendingRequests, getSentRequests]);

  const handleAccept = async (requestId) => {
    try {
      await respondToRequest(requestId, true);
      toast.success("Friend request accepted!");
    } catch {
      // Error toast already shown in store
    }
  };

  const handleReject = async (requestId) => {
    try {
      await respondToRequest(requestId, false);
      toast.success("Friend request rejected");
    } catch {
      // Error toast already shown in store
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-[95%] sm:max-w-lg border border-slate-700/50 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-200">
            Friend Requests
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 border-b border-slate-700">
          <button
            onClick={() => setActiveTab("received")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "received"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Received ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab("sent")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "sent"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sent ({sentRequests.length})
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3">
          {activeTab === "received" ? (
            pendingRequests.length > 0 ? (
              pendingRequests.map((request) => (
                <div
                  key={request._id}
                  className="bg-slate-700/30 rounded-lg p-3 sm:p-4 border border-slate-600/50"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:justify-between">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-cyan-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0">
                        {request.sender.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-slate-200 font-medium text-sm sm:text-base truncate">
                          {request.sender.fullName}
                        </h3>
                        <p className="text-slate-400 text-xs sm:text-sm truncate">
                          {request.sender.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleAccept(request._id)}
                        className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <UserCheck className="w-4 h-4" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(request._id)}
                        className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <UserX className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-sm">
                No pending friend requests
              </div>
            )
          ) : sentRequests.length > 0 ? (
            sentRequests.map((request) => (
              <div
                key={request._id}
                className="bg-slate-700/30 rounded-lg p-3 sm:p-4 border border-slate-600/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-cyan-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0">
                    {request.receiver.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-slate-200 font-medium text-sm sm:text-base truncate">
                      {request.receiver.fullName}
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm truncate">
                      {request.receiver.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-400 text-sm">
                    <Clock className="w-4 h-4" />
                    <span className="hidden sm:inline">Pending</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm">
              No sent friend requests
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
