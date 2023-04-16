import axios from 'axios';
import Link from 'next/link';
import { Bar } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import React, { useEffect, useReducer } from 'react';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, summary: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}
function AdminDashboardScreen() {
  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { salesData: [] },
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/summary`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: summary.salesData.map((x) => x._id), // 2022/01 2022/03
    datasets: [
      {
        label: 'Sales',
        backgroundColor: 'rgba(162, 222, 208, 1)',
        data: summary.salesData.map((x) => x.totalSales),
      },
    ],
  };
  return (
<Layout title="Admin Dashboard">
  <div className="grid  md:grid-cols-4 md:gap-5">
    <div>
      <ul>
        <li>
          <Link href="/admin/dashboard" className="font-bold">
            <button className="w-full p-3 transition-all duration-300 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none">
              Dashboard
            </button>
          </Link>
        </li>
        <li>
          <Link href="/admin/orders">
            <button className="w-full p-3 transition-all duration-300 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none">
              Orders
            </button>
          </Link>
        </li>
        <li>
          <Link href="/admin/products">
            <button className="w-full p-3 transition-all duration-300 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none">
              Products
            </button>
          </Link>
        </li>
        <li>
          <Link href="/admin/users">
            <button className="w-full p-3 transition-all duration-300 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none">
              Users
            </button>
          </Link>
        </li>
      </ul>
    </div>
    <div className="md:col-span-3">
      <h1 className="mb-4 text-xl">Admin Dashboard</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="card p-5 transition-all duration-300 transform hover:scale-105">
              <p className="text-3xl">₹{summary.ordersPrice} </p>
              <p>Sales</p>
              <Link href="/admin/orders">
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg transition-all duration-300 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none">
                  View sales
                </button>
              </Link>
            </div>
            <div className="card p-5 transition-all duration-300 transform hover:scale-105">
              <p className="text-3xl">{summary.ordersCount} </p>
              <p>Orders</p>
              <Link href="/admin/orders">
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg transition-all duration-300 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none">
                  View orders
                </button>
              </Link>
            </div>
            <div className="card p-5 transition-all duration-300 transform hover:scale-105">
              <p className="text-3xl">{summary.productsCount} </p>
              <p>Products</p>
              <Link href="/admin/products">
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg transition-all duration-300 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none">
                  View products
                </button>
              </Link>
            </div>
            <div className="card p-5 transition-all duration-300 transform hover:scale-105">
              <p className="text-3xl">{summary.usersCount} </p>
              <p>Users</p>
                  <Link href="/admin/users">View users</Link>
                </div>
              </div>
              <h2 className="text-xl">Sales Report</h2>
              <Bar
                options={{
                  legend: { display: true, position: 'right' },
                }}
                data={data}
              />
            </div>
          )}
        </div>
      </div>
    </Layout> 

  );
}

AdminDashboardScreen.auth = { adminOnly: true };
export default AdminDashboardScreen;
