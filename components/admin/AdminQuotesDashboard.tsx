"use client";

import { useEffect, useState } from "react";

type Quote = {
  id: string;
  name: string;
  email: string;
  cleaningType: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  condition: string;
  message: string;
  status?: string;
  createdAt: string;
  estimate?: number | null;
};

export default function AdminQuotesDashboard() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadQuotes() {
    const res = await fetch("/api/quotes", { cache: "no-store" });
    const data = await res.json();

    if (data.success) {
      setQuotes(data.quotes);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadQuotes();
  }, []);

  async function updateStatus(
    id: string,
    status: string,
    estimate?: number
  ) {
    await fetch("/api/quotes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, estimate }),
    });

    loadQuotes();
  }

  async function deleteQuote(id: string) {
    await fetch("/api/quotes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    loadQuotes();
  }

  return (
    <main className="min-h-screen bg-[#fff8f6] px-6 py-12">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-10 rounded-[2rem] border border-[#f3d1d8] bg-white/70 backdrop-blur p-8 shadow-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-[#b76e79]">
            Admin
          </p>
          <h1 className="font-serif text-4xl text-[#2c2c2c]">
            Quote Requests
          </h1>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-center text-[#6b6b6b]">Loading quotes...</p>
        )}

        {/* EMPTY STATE */}
        {!loading && quotes.length === 0 && (
          <div className="text-center mt-20">
            <p className="text-xl text-[#6b6b6b]">
              No quote requests yet.
            </p>
            <p className="text-sm text-[#9a7b82] mt-2">
              When clients submit a request, it will appear here.
            </p>
          </div>
        )}

        {/* QUOTES */}
        <div className="grid gap-8">
          {quotes.map((q) => (
            <div
              key={q.id}
              className="rounded-[2rem] border border-[#f3d1d8] bg-white p-6 shadow-lg hover:shadow-xl transition"
            >
              {/* TOP */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="font-serif text-xl text-[#2c2c2c]">
                    {q.name}
                  </h2>
                  <p className="text-sm text-[#7a6259]">
                    {q.email}
                  </p>
                </div>

                <StatusBadge status={q.status || "NEW"} />
              </div>

              {/* DETAILS */}
              <div className="grid md:grid-cols-2 gap-4 text-sm text-[#5a3f45]">
                <p><strong>Service:</strong> {q.cleaningType}</p>
                <p><strong>Condition:</strong> {q.condition}</p>
                <p><strong>Size:</strong> {q.bedrooms} bed / {q.bathrooms} bath</p>
                <p><strong>Sq Ft:</strong> {q.sqft}</p>
              </div>

              {/* MESSAGE */}
              {q.message && (
                <div className="mt-4 p-4 rounded-xl bg-[#fff1f4] text-sm text-[#5a3f45]">
                  {q.message}
                </div>
              )}

              {/* ESTIMATE DISPLAY */}
              {q.estimate && (
                <div className="mt-4 text-lg font-semibold text-[#b76e79]">
                  Estimated Price: ${q.estimate}
                </div>
              )}

              {/* ESTIMATE INPUT + ACTIONS */}
              <div className="mt-6 space-y-3">

                <input
                  type="number"
                  placeholder="Enter estimate ($)"
                  defaultValue={q.estimate || ""}
                  className="w-full rounded-xl border border-[#e8cfd5] px-4 py-2"
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setQuotes((prev) =>
                      prev.map((item) =>
                        item.id === q.id
                          ? { ...item, estimate: value }
                          : item
                      )
                    );
                  }}
                />

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      updateStatus(q.id, "APPROVED", q.estimate)
                    }
                    className="px-4 py-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition"
                  >
                    Approve & Send Quote
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(q.id, "REJECTED")
                    }
                    className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => deleteQuote(q.id)}
                    className="px-4 py-2 rounded-full bg-gray-800 text-white hover:bg-black transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: any = {
    NEW: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status]}`}
    >
      {status}
    </span>
  );
}