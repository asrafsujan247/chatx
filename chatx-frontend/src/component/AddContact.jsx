import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Search, UserPlus, X } from "lucide-react";
import toast from "react-hot-toast";

export const AddContact = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { searchUserByEmail, addContact } = useChatStore();

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    setIsSearching(true);
    setSearchResult(null);

    try {
      const result = await searchUserByEmail(email.trim());
      setSearchResult(result);
    } catch {
      setSearchResult(null);
      // Error toast is already shown in the store
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddContact = async () => {
    if (!searchResult) return;

    setIsAdding(true);
    try {
      await addContact(searchResult.email);
      toast.success(`${searchResult.fullName} added to contacts!`);
      setEmail("");
      setSearchResult(null);
      onClose();
    } catch {
      // Error toast is already shown in the store
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-[95%] sm:max-w-md border border-slate-700/50 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-200 flex items-center gap-2">
            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            <span className="hidden xs:inline">Add Contact</span>
            <span className="xs:hidden">Add Contact</span>
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="flex-1 bg-slate-700/50 border border-slate-600 rounded-s-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              disabled={isSearching}
            />
            <button
              type="submit"
              disabled={isSearching}
              className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 text-white px-4 py-2 rounded-e-lg transition-colors flex items-center justify-center gap-2"
            >
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-sm">Search</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Search Result */}
        {searchResult && (
          <div className="bg-slate-700/30 rounded-lg p-3 sm:p-4 border border-slate-600/50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:justify-between">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-cyan-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0">
                  {searchResult.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-slate-200 font-medium text-sm sm:text-base truncate">
                    {searchResult.fullName}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm truncate">
                    {searchResult.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleAddContact}
                disabled={isAdding}
                className="bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm w-full sm:w-auto min-w-[80px]"
              >
                {isAdding ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Add
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!searchResult && !isSearching && (
          <div className="text-slate-400 text-xs sm:text-sm text-center mt-4 px-2">
            Add users to your contacts by entering their email address for
            secure messaging.
          </div>
        )}
      </div>
    </div>
  );
};
