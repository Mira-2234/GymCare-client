"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";

function TableSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-12 animate-pulse rounded-lg bg-white/5"
        />
      ))}
    </div>
  );
}

export default function AdminTransactionsPage() {
  const { data: session } = useSession();

  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.email) return;

    setLoading(true);

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/transactions?page=${page}&limit=10&email=${session.user.email}`
    )
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch transactions");
        }
        return res.json();
      })
      .then((data) => {
        setTransactions(data.transactions || []);
        setPagination(
          data.pagination || {
            totalPages: 1,
            totalCount: 0,
          }
        );
      })
      .catch((err) => {
        console.error("Transactions fetch error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, session]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#F5F3EF]">
        Transactions
      </h1>

      <p className="mt-1 text-sm text-[#9A9CA6]">
        All Stripe payment history — {pagination.totalCount} total
        transactions.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#1C1D24]">
        {loading ? (
          <div className="p-5">
            <TableSkeleton />
          </div>
        ) : transactions.length === 0 ? (
          <p className="py-16 text-center text-sm text-[#9A9CA6]">
            No transactions yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-[#6B6D78]">
                  <th className="px-5 py-3">User Email</th>
                  <th className="px-5 py-3">Class</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Transaction ID</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((txn) => (
                  <tr
                    key={txn._id}
                    className="border-b border-white/5 last:border-0"
                  >
                    <td className="px-5 py-4 text-[#F5F3EF]">
                      {txn.attendeeEmail}
                    </td>

                    <td className="px-5 py-4 text-[#9A9CA6]">
                      {txn.className}
                    </td>

                    <td className="px-5 py-4 font-semibold text-[#FF5B3C]">
                      ${txn.price}
                    </td>

                    <td className="px-5 py-4 text-[#9A9CA6]">
                      {txn.bookedAt
                        ? new Date(txn.bookedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "-"}
                    </td>

                    <td className="px-5 py-4 font-mono text-xs text-[#6B6D78]">
                      {txn.transactionId || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() =>
              setPage((prev) => Math.max(prev - 1, 1))
            }
            disabled={page === 1}
            className="rounded-lg border border-white/10 px-3 py-2 text-sm text-[#9A9CA6] disabled:opacity-30"
          >
            ← Prev
          </button>

          <span className="px-3 text-sm text-[#9A9CA6]">
            Page {page} of {pagination.totalPages}
          </span>

          <button
            onClick={() =>
              setPage((prev) =>
                Math.min(prev + 1, pagination.totalPages)
              )
            }
            disabled={page === pagination.totalPages}
            className="rounded-lg border border-white/10 px-3 py-2 text-sm text-[#9A9CA6] disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}