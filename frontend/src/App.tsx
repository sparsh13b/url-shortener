import { useState, useEffect } from "react";
import { API_BASE_URL } from "./config";

function App() {
  
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [clickCount, setClickCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  useEffect(() => {
    const savedShortUrl = localStorage.getItem("shortUrl");
    const savedSlug = localStorage.getItem("slug");

    if (savedShortUrl && savedSlug) {
      setShortUrl(savedShortUrl);
      setSlug(savedSlug);
      fetchAnalytics(savedSlug);
    }
  }, []);
  async function handleShorten() {
    if (!url) return;

    setLoading(true);
    setShortUrl("");
    setSlug("");
    setClickCount(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      setShortUrl(data.shortUrl);
      setSlug(data.slug);
      localStorage.setItem("shortUrl", data.shortUrl);
      localStorage.setItem("slug", data.slug);
      // fetch analytics part
      fetchAnalytics(data.slug);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
 
  
  
  async function fetchAnalytics(slug: string) {
  if (!slug) return;

  try {
    setLoadingAnalytics(true);
    const res = await fetch(
  `${API_BASE_URL}/api/analytics/${slug}`,
  { cache: "no-store" }
);
    const data = await res.json();
    setClickCount(data.totalClicks);
  } catch (err) {
    console.error(err);
    setClickCount(null);
  } finally {
    setLoadingAnalytics(false);
  }
}

  

  
  return (
    <div className="min-h-screen bg-[#f6ede3] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl mb-6">URL Shortener</h1>

      <div className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Enter a long URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-400 w-64"
        />

        <button
          onClick={handleShorten}
          disabled={loading}
          className="bg-[#bdeceb] px-4 py-2 rounded-lg border border-gray-700"
        >
          {loading ? "Shortening..." : "Shorten"}
        </button>
      </div>

      {shortUrl && (
        <div className="mb-4">
          <p className="mb-1">Short URL:</p>
          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            className="text-purple-700 underline"
          >
            {shortUrl}
          </a>
        </div>
      )}

      
      {slug && (
        <div className="mt-4">
          <p className="font-medium">Analytics</p>

          {loadingAnalytics ? (
            <p>Loading clicks...</p>
          ) : (
            <p>Total Clicks: {clickCount ?? 0}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
