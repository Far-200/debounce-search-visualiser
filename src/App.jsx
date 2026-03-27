import { useEffect, useMemo, useState } from "react";

const DEBOUNCE_DELAY = 200;

const DATA = [
  "React",
  "Redux",
  "Node.js",
  "Express",
  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "JavaScript",
  "TypeScript",
  "Tailwind CSS",
  "HTML",
  "CSS",
  "Python",
  "C",
  "C++",
  "Java",
  "Docker",
  "Kubernetes",
  "Git",
  "GitHub",
  "VS Code",
  "Vite",
  "Next.js",
  "Firebase",
  "Supabase",
  "Machine Learning",
  "Artificial Intelligence",
  "Computer Networks",
  "DBMS",
  "Operating Systems",
  "Data Structures",
  "Algorithms",
  "REST API",
  "GraphQL",
  "JWT Authentication",
  "Socket.IO",
  "Linux",
  "Cybersecurity",
  "Prompt Engineering",
  "System Design",
  "Games Development",
  "Technology",
  "Tech Stack",
];

function fakeSearchApi(query) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = DATA.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase()),
      );
      resolve(filtered);
    }, 800);
  });
}

export default function App() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("Idle");
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    if (!query.trim()) {
      setDebouncedQuery("");
      setResults([]);
      setStatus("Idle");
      return;
    }

    setStatus("Waiting for debounce...");

    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery.trim()) return;

    let isCancelled = false;

    async function runSearch() {
      setStatus("Searching...");
      setRequestCount((prev) => prev + 1);

      const data = await fakeSearchApi(debouncedQuery);

      if (!isCancelled) {
        setResults(data);
        setStatus("Results ready");
      }
    }

    runSearch();

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery]);

  const typingIndicator = useMemo(() => {
    if (!query.trim()) return "Start typing to search";
    if (query !== debouncedQuery) return "Typing detected";
    return "Input settled";
  }, [query, debouncedQuery]);

  return (
    <div className="app">
      <div className="card">
        <h1>Debounce Search Visualizer</h1>
        <p className="subtitle">
          Type fast and watch how requests wait until you stop typing.
        </p>

        <div className="input-section">
          <input
            type="text"
            placeholder="Search tech topics...🫠"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setStatus("Typing...");
            }}
          />
        </div>

        <div className="status-grid">
          <div className="status-box">
            <span className="label">Live Input</span>
            <span className="value">{query || "-"}</span>
          </div>

          <div className="status-box">
            <span className="label">Debounced Input</span>
            <span className="value">{debouncedQuery || "-"}</span>
          </div>

          <div className="status-box">
            <span className="label">Status</span>
            <span className="value">{status}</span>
          </div>

          <div className="status-box">
            <span className="label">Requests Sent</span>
            <span className="value">{requestCount}</span>
          </div>
        </div>

        <div className="explain">
          <p>
            <strong>Typing State:</strong> {typingIndicator}
          </p>
          <p>
            <strong>How it works:</strong> Every new keystroke resets a{" "}
            {DEBOUNCE_DELAY}ms timer. Only when the timer finishes do we send
            the search request.
          </p>
        </div>

        <div className="results">
          <h2>Results</h2>
          {!query.trim() ? (
            <p className="empty">Nothing yet. Feed me letters.</p>
          ) : results.length > 0 ? (
            <ul>
              {results.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : status === "Searching..." ||
            status === "Waiting for debounce..." ? (
            <p className="empty">Searching soon...</p>
          ) : (
            <p className="empty">F**k, no results. Update DATA, maybe?</p>
          )}
        </div>
      </div>
    </div>
  );
}
