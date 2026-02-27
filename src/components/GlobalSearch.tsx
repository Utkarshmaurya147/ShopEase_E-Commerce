"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import api from "@/utils/api";

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut (Cmd+K or Ctrl+K) to open search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Fetch live suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setIsTyping(true);
      try {
        const { data } = await api.get(`/products/all?search=${encodeURIComponent(query)}`);
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsTyping(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(path);
  };

  if (!isOpen)
    return (
      <div
        onClick={() => setIsOpen(true)}
        className="relative w-full max-w-sm cursor-pointer group"
      >
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
          <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
        </span>
        <div className="w-full text-gray-400 bg-gray-50 border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm hover:bg-white hover:border-blue-200 transition-all flex items-center justify-between">
          <span>Search products...</span>
          <kbd className="hidden xl:block bg-white border border-gray-200 px-1.5 py-0.5 rounded text-[10px] font-black text-gray-300">
            ⌘ K
          </kbd>
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 bg-[#0a1128]/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Input Area */}
        <div className="relative p-6 border-b border-gray-100">
          <MagnifyingGlassIcon className="absolute left-10 top-1/2 -translate-y-1/2 h-6 w-6 text-blue-600" />
          <input
            ref={inputRef}
            autoFocus
            type="text"
            placeholder="Search products, brands, or categories..."
            className="w-full pl-14 pr-12 py-4 bg-gray-50 rounded-3xl text-lg font-bold text-gray-900 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && handleNavigate(`/products?search=${query}`)
            }
          />
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-10 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 no-scrollbar">
          {query.length > 0 ? (
            <div className="space-y-2">
              <p className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {isTyping ? "Searching..." : "Top Results"}
              </p>
              {results.map((product: any) => (
                <button
                  key={product.id}
                  onClick={() => handleNavigate(`/products/${product.id}`)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-blue-50 rounded-[24px] transition-all group text-left"
                >
                  <img
                    src={product.image}
                    className="w-14 h-14 rounded-2xl object-cover bg-gray-100"
                  />
                  <div className="flex-1">
                    <h4 className="font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-xs font-bold text-blue-500 uppercase tracking-tighter">
                      ${product.price}
                    </p>
                  </div>
                  <SparklesIcon className="h-5 w-5 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
              {results.length === 0 && !isTyping && (
                <div className="py-12 text-center">
                  <p className="text-gray-400 font-medium italic">
                    No products found for "{query}"
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 px-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                Trending Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {["Boots", "Headphones", "Beauty", "Suit", "Books"].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-5 py-2.5 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-2xl text-sm font-bold text-gray-600 transition-all"
                    >
                      {tag}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 flex items-center justify-between border-t border-gray-100">
          <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <span>
              <kbd className="bg-white border rounded px-1.5 py-0.5">ESC</kbd>{" "}
              to close
            </span>
            <span>
              <kbd className="bg-white border rounded px-1.5 py-0.5">ENTER</kbd>{" "}
              to search all
            </span>
          </div>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
            ShopEase AI Search
          </p>
        </div>
      </div>
    </div>
  );
}
