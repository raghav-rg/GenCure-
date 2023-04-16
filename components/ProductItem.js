/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React from 'react';
import { motion } from "framer-motion";
export default function ProductItem({ product, addToCartHandler }) {
  return (
    <motion.div 
      className="card bg-white rounded-lg shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/product/${product.slug}`}>
        <motion.img
          src={product.image}
          alt={product.name}
          className="rounded-t-lg h-64 w-full object-cover"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        />
      </Link>
      <motion.div className="flex flex-col items-center justify-center p-5">
        <Link href={`/product/ ₹{product.slug}`}>
          <h2 className="text-lg">{product.name}</h2>
        </Link>
        <p className="mb-2 text-purple-800">{product.brand}</p>
        <p className="text-2xl font-bold text-purple-800">₹ {product.price}</p>
        <motion.button
          className="bg-purple-800 text-white px-5 py-2 rounded-lg mt-3"
          type="button"
          onClick={() => addToCartHandler(product)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Add to cart
        </motion.button>
      </motion.div>
      </motion.div>
  );
}
