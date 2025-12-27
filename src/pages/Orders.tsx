
import React, { useEffect, useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-cyan-100 text-cyan-800",
  out_for_delivery: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const Orders: React.FC = () => {
  const { fetchUserOrders, loading } = useOrders();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getOrders = async () => {
      setFetching(true);
      const data = await fetchUserOrders();
      setOrders(data);
      setFetching(false);
    };
    if (user) getOrders();
    else setFetching(false);
    // eslint-disable-next-line
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-gray-500">Please sign in to view your order history.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
        aria-label="Go back"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
      <h1 className="text-3xl font-bold text-center mb-8">My Orders</h1>
      {fetching || loading ? (
        <div className="flex justify-center items-center h-32">
          <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-2"></span>
          <span className="text-gray-600">Loading your orders...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-500">You have no orders yet.</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow rounded-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex-1 mb-4 md:mb-0">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
                  <div>
                    <div className="text-lg font-semibold">Order #{order.order_number}</div>
                    <div className="text-gray-500 text-sm">{new Date(order.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}>
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-xl font-bold text-accent">Rs. {order.total}</div>
                <div className="text-gray-400 text-xs mt-1">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
