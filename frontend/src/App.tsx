import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleShorten() {
    if (!url) return;

    setLoading(true);
    setShortUrl("");
    setSlug("");

    const res = await fetch("http://localhost:4000/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();
    setShortUrl(data.shortUrl);
    setSlug(data.slug);
    setLoading(false);
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="min-h-screen bg-[#f6ede3] flex flex-col items-center justify-center px-4 text-center">
      {/* Title */}
      <h1
        className="text-5xl mb-6"
        style={{ fontFamily: "Fredoka, sans-serif" }}
      >
        URL Shortner
      </h1>

      {/* Description */}
      <p className="max-w-2xl text-gray-800 mb-10 leading-relaxed"></p>

      {/* Input + button */}
      <div className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Enter Link"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-400 w-64 focus:outline-none"
        />

        <button
          onClick={handleShorten}
          disabled={loading}
          className="bg-[#bdeceb] px-4 py-2 rounded-lg border border-gray-700 hover:bg-[#a8dfdd] transition"
        >
          {loading ? "Shortening..." : "Shorten Link"}
        </button>
      </div>

      {/* Short code */}
      {slug && (
        <div className="flex items-center gap-4 mb-6">
          <span className="text-lg">
            Your Shortend Code: <b>{slug}</b>
          </span>

          <button
            onClick={() => copy(slug)}
            className="bg-[#bdeceb] px-4 py-2 rounded-lg border border-gray-700"
          >
            Copy
          </button>
        </div>
      )}

      {/* Full link */}
      {shortUrl && (
        <div className="flex items-center gap-4">
          <div>
            <p className="text-lg mb-1">Your Shortend Link:</p>
            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              className="text-purple-700 underline break-all"
            >
              {shortUrl}
            </a>
          </div>

          <button
            onClick={() => copy(shortUrl)}
            className="bg-[#bdeceb] px-4 py-2 rounded-lg border border-gray-700"
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
