"use client";

import React, { useState } from "react";
import { updateOrderStatusAction } from "@/app/admin/actions";
import { Calendar, Search, Filter, Box, Truck, CheckCircle, Package, ChevronDown, ChevronUp } from "lucide-react";

export function AdminOrdersView({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: string, orderData: any) => {
    setLoadingId(orderId);
    try {
      const res = await updateOrderStatusAction(orderId, newStatus, orderData);
      if (res.success) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      } else {
        alert("Failed to update status: " + res.error);
      }
    } catch (e) {
      alert("Error updating status");
    }
    setLoadingId(null);
  };

  const filteredOrders = orders.filter(o => {
    // Search filter
    const searchString = `${o.customerName} ${o.orderNumber} ${o._id}`.toLowerCase();
    if (search && !searchString.includes(search.toLowerCase())) return false;
    
    // Status filter
    if (statusFilter !== "all" && o.status?.toLowerCase() !== statusFilter) return false;
    
    // Date filter
    if (dateStart) {
      const dStart = new Date(dateStart);
      const oDate = new Date(o._createdAt);
      if (oDate < dStart) return false;
    }
    if (dateEnd) {
      const dEnd = new Date(dateEnd);
      dEnd.setHours(23, 59, 59, 999);
      const oDate = new Date(o._createdAt);
      if (oDate > dEnd) return false;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-pink-50/30 p-8 pt-32">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <Package className="text-primary w-8 h-8" />
          Advanced Orders Management
        </h1>

        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Search Orders</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Name, Order ID..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary"
              />
            </div>
          </div>
          
          <div className="w-48">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">From Date</label>
            <input 
              type="date" 
              value={dateStart} 
              onChange={e => setDateStart(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary"
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">To Date</label>
            <input 
              type="date" 
              value={dateEnd} 
              onChange={e => setDateEnd(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="p-4 font-semibold whitespace-nowrap">Order Details</th>
                  <th className="p-4 font-semibold whitespace-nowrap">Customer</th>
                  <th className="p-4 font-semibold whitespace-nowrap">Amount</th>
                  <th className="p-4 font-semibold whitespace-nowrap text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-400">No orders found matching your criteria.</td>
                  </tr>
                ) : (
                  filteredOrders.map(order => {
                    const isExpanded = expandedId === order._id;
                    return (
                    <React.Fragment key={order._id}>
                      <tr 
                        className={`hover:bg-gray-50 transition-colors cursor-pointer ${isExpanded ? 'bg-pink-50/30' : ''}`}
                        onClick={() => setExpandedId(isExpanded ? null : order._id)}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                            <div>
                              <p className="font-bold text-gray-900">#{order.orderNumber || order._id.slice(0, 8).toUpperCase()}</p>
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                <Calendar className="w-3 h-3"/> {new Date(order._createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 ml-6 text-xs text-gray-600 bg-gray-100 rounded px-2 py-1 max-w-[max-content]">
                            {order.items?.length || 0} items
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-gray-800">{order.customerName}</p>
                          <p className="text-xs text-gray-500">{order.email}</p>
                          <p className="text-xs text-gray-500">{order.phone}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[200px] mt-1" title={order.address}>{order.address}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-primary">LKR {order.totalAmount?.toLocaleString()}</p>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mt-1 inline-block ${order.paymentMethod === 'online' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {order.paymentMethod === 'online' ? 'Paid Online' : 'COD'}
                          </span>
                        </td>
                        <td className="p-4 align-top text-center" onClick={(e) => e.stopPropagation()}>
                          <select 
                            value={order.status || 'pending'}
                            disabled={loadingId === order._id}
                            onChange={(e) => handleStatusChange(order._id, e.target.value, order)}
                            className={`
                              px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border-2 outline-none cursor-pointer appearance-none text-center min-w-[120px] transition-all
                              ${loadingId === order._id ? 'opacity-50 cursor-wait' : ''}
                              ${order.status === 'delivered' ? 'bg-green-50 border-green-200 text-green-700' : 
                                order.status === 'shipped' ? 'bg-purple-50 border-purple-200 text-purple-700' : 
                                order.status === 'paid' ? 'bg-blue-50 border-blue-200 text-blue-700' : 
                                order.status === 'cancelled' ? 'bg-red-50 border-red-200 text-red-700' :
                                'bg-amber-50 border-amber-200 text-amber-700'}
                            `}
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <p className="text-[10px] text-gray-400 mt-2">Email auto-sends on change</p>
                        </td>
                      </tr>
                      {/* Expanded Sub-row */}
                      {isExpanded && (
                        <tr className="bg-pink-50/20">
                          <td colSpan={4} className="p-6 border-b border-pink-100">
                            <h4 className="text-sm font-bold text-gray-800 mb-4">Ordered Items</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {order.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex gap-4 items-center bg-white p-3 rounded-xl shadow-sm border border-pink-100">
                                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center">
                                    {item.imageUrl ? (
                                      <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                                    ) : (
                                      <Package className="w-6 h-6 text-gray-300" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.productName}</p>
                                    <p className="text-xs text-gray-500">Size: <span className="font-semibold text-gray-700">{item.size || "Standard"}</span></p>
                                    <p className="text-xs text-gray-500">Qty: <span className="font-semibold text-gray-700">{item.quantity}</span> x LKR {item.price}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )})
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
