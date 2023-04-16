import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Menu } from '@headlessui/react';
import 'react-toastify/dist/ReactToastify.css';
import { Store } from '../utils/Store';
import DropdownLink from './DropdownLink';
import { useRouter } from 'next/router';
import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon';
import { motion } from "framer-motion";


export default function Layout({ title, children }) {
  const { status, data: session } = useSession();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const logoutClickHandler = () => {
    Cookies.remove('cart');
    dispatch({ type: 'CART_RESET' });
    signOut({ callbackUrl: '/login' });
  };

  const [query, setQuery] = useState('');

  const router = useRouter();
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  return (
    <>
      <Head>
        <title>{title ? title + ' - Gencure' : 'Gencure'} </title>
        <meta name="description" content="Online marketplace for affordable generic medicine" />
        <link rel="icon" href='/favicon.ico' />
      </Head>
  
      <ToastContainer position="bottom-center" limit={1} />
  
      <div className="flex flex-col h-screen">
      <motion.header initial={{ y: -100 }} animate={{ y: 0 }}>
      
      <nav class="flex items-center justify-between max-w-6xl mx-auto px-6 py-4">
  <Link href="/">
    <motion.span whileHover={{ scale: 1.1 }} class="text-3xl font-bold text-gray-800">
      <img src="../GenCure(2).png" alt="Gencure" className='' />
    </motion.span>
  </Link>


          <motion.form
  onSubmit={submitHandler}
  className="flex-grow mx-6 hidden md:flex"
  variants={{
    hidden: { opacity: 0, x: "-100%" },
    visible: { opacity: 1, x: 0 },
  }}
  initial="hidden"
  animate="visible"
>
  <motion.div
    className="relative flex-shrink-0 w-12"
    variants={{
      hidden: { width: 0 },
      visible: { width: "auto" },
    }}
  >
    {/* search icon */}
  </motion.div>
  <motion.div
    className="flex-grow"
    variants={{
      hidden: { opacity: 0, x: "-100%" },
      visible: { opacity: 1, x: 0 },
    }}
  >
    <input
      onChange={(e) => setQuery(e.target.value)}
      type="text"
      className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-md focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-400"
      placeholder="Search your medications"
    />
  </motion.div>
  <motion.div
    className="flex-shrink-0"
    variants={{
      hidden: { width: 0 },
      visible: { width: "auto" },
    }}
  >
    <button
      className="px-4 py-2 font-bold text-white bg-blue-400 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
      type="submit"
      id="button-addon2"
    >
      <SearchIcon className="h-5 w-5"></SearchIcon>
    </button>
  </motion.div>
</motion.form>

<div className="flex items-center">
  <Link href="/cart" className="relative ml-4">
    <motion.svg
      className="w-6 h-6 text-gray-800 hover:text-gray-900"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.993 8.51v-2.2a2.209 2.209 0 00-2.207-2.207H6.213A2.209 2.209 0 004.006 6.31v2.2l-2 9.8a1 1 0 001 1.2h18a1 1 0 001-1.2l-2-9.8zM6.007 6.31h11.986v2.2H6.007V6.31zm9.752 9.8a.208.208 0 01-.208.207H8.449a.208.208 0 01-.207-.207v-1.627a.208.208 0 01.207-.207h7.1a.208.208 0 01.207.207v1.627z" />
    </motion.svg>
    <span className="absolute top-0 right-0 inline-block w-4 h-4 bg-red-500 text-white text-xs rounded-full transition">
      {cartItemsCount}
    </span>
  </Link>

              {status === 'loading' ? (
                <span className="ml-4 text-gray-800">Loading</span>
              ) : session?.user ? (
                <Menu as="div" className="relative ml-4 z-50">
                <Menu.Button className="flex items-center text-gray-800 hover:text-gray-900 z-50">
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {session.user.name}
                  </motion.span>
                  <svg className="w-4 h-4 ml-1 fill-current" viewBox="0 0 20 20"></svg>
                </Menu.Button>
                <motion.div 
                  className="absolute right-0 w-56 origin-top-right bg-white shadow-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu.Items>
                    <Menu.Item>
                      <DropdownLink className="dropdown-link z-50" href="/profile">
                        <motion.span 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          Profile
                        </motion.span>
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink
                        className="dropdown-link z-50"
                        href="/order-history"
                      >
                        <motion.span 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          Order History
                        </motion.span>
                      </DropdownLink>
                    </Menu.Item>
                    {session.user.isAdmin && (
                      <Menu.Item>
                        <DropdownLink
                          className="dropdown-link z-50"
                          href="/admin/dashboard"
                        >
                          <motion.span 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            Admin Dashboard
                          </motion.span>
                        </DropdownLink>
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      <a
                        className="dropdown-link z-50"
                        href="#"
                        onClick={logoutClickHandler}
                      >
                        <motion.span 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          Logout
                        </motion.span>
                      </a>
                    </Menu.Item>
                  </Menu.Items>
                </motion.div>
              </Menu>
              ) : (
                <Link href="/login" className="p-2">
                  Login to your acccount
                   </Link>
              )}
            </div>
          </nav>
        </motion.header>
        <main className="container m-auto mt-4 px-4 z-10">{children}</main>
        <footer class="flex justify-center items-center bg-gray-100 p-4 rounded-lg">
  <p class="hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 transition-colors ease-in-out duration-150 rounded-lg mr-4">
    <span class="text-sm">Copyright</span>
  </p>
  <button class="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:rotate-3">
    <span class="text-sm">Contact Us</span>
  </button>
</footer>



      </div>
    </>
  ); 
  
}