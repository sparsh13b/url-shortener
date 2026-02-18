import { useState, useEffect } from "react";
import { API_BASE_URL } from "./config";
import AnalyticsDashboard from "./AnalyticsDashboard";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const [analyticsData, setAnalyticsData] = useState<any>(null); // Using any for simplicity here, ideally import interface
  const [loading, setLoading] = useState(false);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  useEffect(() => {
    const savedShortUrl = localStorage.getItem("shortUrl");
    const savedSlug = localStorage.getItem("slug");

    if (savedShortUrl && savedSlug) {
      setShortUrl(savedShortUrl);
      fetchAnalytics(savedSlug);
    }
  }, []);

  async function handleShorten() {
    if (!url) return;

    setLoading(true);
    setShortUrl("");
    setAnalyticsData(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (res.ok) {
        setShortUrl(data.shortUrl);
        localStorage.setItem("shortUrl", data.shortUrl);
        localStorage.setItem("slug", data.slug);
        fetchAnalytics(data.slug);
      } else {
        console.error("Shorten error:", data);
        alert(data.error || "Failed to shorten URL");
      }
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
      const res = await fetch(`${API_BASE_URL}/api/analytics/${slug}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (res.ok) {
        setAnalyticsData(data);
      }
    } catch (err) {
      console.error(err);
      setAnalyticsData(null);
    } finally {
      setLoadingAnalytics(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center py-20 px-4 font-sans text-gray-900">

      <div className="w-full max-w-2xl text-center">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight text-black">
          Url Shortener.
        </h1>
        <p className="text-gray-500 mb-10 text-lg">
          Minimal links. Maximum impact.
        </p>

        <div className="flex gap-0 shadow-sm rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-black transition-all bg-white mb-12">
          <input
            type="text"
            placeholder="Paste your long link here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 px-6 py-4 outline-none text-lg text-black placeholder-gray-400"
          />
          <button
            onClick={handleShorten}
            disabled={loading}
            className="bg-black text-white px-8 py-4 font-medium text-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "Shorten"}
          </button>
        </div>

        {shortUrl && (
          <div className="mb-12 p-6 bg-white border border-gray-200 rounded-lg text-left flex items-center justify-between shadow-sm animate-fade-in-up">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Generated Link</p>
              <a
                href={shortUrl}
                target="_blank"
                rel="noreferrer"
                className="text-2xl font-semibold text-black hover:underline decoration-1 underline-offset-4"
              >
                {shortUrl}
              </a>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(shortUrl)}
              className="p-3 text-gray-500 hover:text-black hover:bg-gray-100 rounded-md transition-colors"
              title="Copy to clipboard"
            >
              📋
            </button>
          </div>
        )}
      </div>

      {loadingAnalytics ? (
        <div className="mt-12 text-gray-400 animate-pulse">Loading data...</div>
      ) : (
        analyticsData && <AnalyticsDashboard data={analyticsData} />
      )}
    </div>
  );
}

export default App;
