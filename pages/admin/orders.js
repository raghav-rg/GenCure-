import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useReducer } from 'react';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

export default function AdminOrderScreen() {
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/orders`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  return (
<Layout title="Admin Dashboard">
  <div className="grid md:grid-cols-4 md:gap-5">
    <div>
      <ul className="space-y-2">
        <li>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center w-full transition-all duration-300 ease-in-out py-2 px-4 rounded-lg hover:bg-gray-100"
          >
            <span className="text-gray-600">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/orders"
            className="inline-flex items-center w-full transition-all duration-300 ease-in-out py-2 px-4 rounded-lg hover:bg-gray-100 font-bold"
          >
            <span className="text-gray-900">Orders</span>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/products"
            className="inline-flex items-center w-full transition-all duration-300 ease-in-out py-2 px-4 rounded-lg hover:bg-gray-100"
          >
            <span className="text-gray-600">Products</span>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/users"
            className="inline-flex items-center w-full transition-all duration-300 ease-in-out py-2 px-4 rounded-lg hover:bg-gray-100"
          >
            <span className="text-gray-600">Users</span>
          </Link>
        </li>
      </ul>
    </div>
    <div className="overflow-x-auto md:col-span-3">
      <h1 className="mb-4 text-xl">Admin Orders</h1>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b">
              <tr>
                <th className="px-5 text-left">ID</th>
                <th className="p-5 text-left">USER</th>
                <th className="p-5 text-left">DATE</th>
                <th className="p-5 text-left">TOTAL</th>
                <th className="p-5 text-left">PAID</th>
                <th className="p-5 text-left">DELIVERED</th>
                <th className="p-5 text-left">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="p-5">{order._id.substring(20, 24)}</td>
                  <td className="p-5">
                    {order.user ? order.user.name : 'DELETED USER'}
                  </td>
                  <td className="p-5">
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td className="p-5">₹{order.totalPrice}</td>
                  <td className="p-5">
                    {order.isPaid
                      ? `${order.paidAt.substring(0, 10)}`
                      : 'not paid'}
                  </td>
                  <td className="p-5">
                    {order.isDelivered
                      ? `${order.deliveredAt.substring(0, 10)}`
                      : 'not delivered'}
                  </td>
                  <td className="p-5">
                    <Link
                      href={`/order/${order._id}`} passHref>
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
</Layout> 

  );
}

AdminOrderScreen.auth = { adminOnly: true };
