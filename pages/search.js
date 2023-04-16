import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon';
import ProductItem from '../components/ProductItem';
import Product from '../models/Product';
import db from '../utils/db';


const PAGE_SIZE = 2;

const prices = [
  {
    name: '₹1 to ₹50',
    value: '1-50',
  },
  {
    name: '₹51 to ₹200',
    value: '51-200',
  },
  {
    name: '₹201 to ₹1000',
    value: '201-1000',
  },
];






const ratings = [1, 2, 3, 4, 5];

export default function Search(props) {
  const router = useRouter();

  const {
    query = 'all',
    category = 'all',
    brand = 'all',
    price = 'all',
    rating = 'all',
    sort = 'featured',
    page = 1,
  } = router.query;

  const { products, countProducts, categories,  pages, description } = props;

  const filterSearch = ({
    page,
    category,
    brand,
    sort,
    min,
    max,
    searchQuery,
    price,
    rating,
    description,
    
  }) => {
    const { query } = router;
    if (page) query.page = page;
    if (searchQuery) query.searchQuery = searchQuery;
    if (sort) query.sort = sort;
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (price) query.price = price;
    if (rating) query.rating = rating;
    if (min) query.min ? query.min : query.min === 0 ? 0 : min;
    if (max) query.max ? query.max : query.max === 0 ? 0 : max;
    if (description) query.description = description;
    

    router.push({
      pathname: router.pathname,
      query: query,
    });
  };
  const categoryHandler = (e) => {
    filterSearch({ category: e.target.value });
  };
  const pageHandler = (page) => {
    filterSearch({ page });
  };
  
  const sortHandler = (e) => {
    filterSearch({ sort: e.target.value });
  };
  const priceHandler = (e) => {
    filterSearch({ price: e.target.value });
  };
  const ratingHandler = (e) => {
    filterSearch({ rating: e.target.value });
  };
  const searchbyslug = (slug) => {
    const matchingProducts = products.filter((p) => p.slug.includes(slug));
    return matchingProducts;
  };
  const searchBySlugHandler = (e) => {
    const slug = e.target.value;
    const matchingProducts = searchbyslug(slug);
    const searchQuery = matchingProducts.map((p) => p.name).join(" ");
    filterSearch({ searchQuery });
  };
  

  

  const { state, dispatch } = useContext(Store);
  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      toast.error('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };
  return (
<Layout title="search">
  <div className="grid md:grid-cols-4 md:gap-5">
    <div className="mb-5 md:mb-0 md:pr-5">
      <div className="mb-5">
        <h2 className="mb-2 font-bold text-lg text-gray-800">Categories</h2>
        <select
          className="w-full p-2 border border-gray-400 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          value={category}
          onChange={categoryHandler}
        >
          <option value="all">All</option>
          {categories &&
            categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
        </select>
      </div>
      
      <div className="mb-5">
        <h2 className="mb-2 font-bold text-lg text-gray-800">Prices</h2>
        <select
          className="w-full p-2 border border-gray-400 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          value={price}
          onChange={priceHandler}
        >
          <option value="all">All</option>
          {prices &&
            prices.map((price) => (
              <option key={price.value} value={price.value}>
                {price.name}
              </option>
            ))}
        </select>
      </div>
      <div className="mb-5">
  <h2 className="mb-2 font-bold text-lg text-gray-800">Search by composition</h2>
  <input
    type="text"
    className="w-full p-2 border border-gray-400 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
    placeholder="Search by composition"
    onInput={searchBySlugHandler}
  />
</div>

      <div className="mb-5">
        <h2 className="mb-2 font-bold text-lg text-gray-800">Description</h2>
        <input
          type="text"
          className="w-full p-2 border border-gray-400 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          placeholder="Search by description"
          value={description}
        />
      </div>
    
  );
      <div className="mb-5">
        <h2 className="mb-2 font-bold text-lg text-gray-800">Ratings</h2>
        <select
          className="w-full p-2 border border-gray-400 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          value={rating}
          onChange={ratingHandler}
        >
          <option value="all">All</option>
          {ratings &&
            ratings.map((rating) => (
              <option key={rating} value={rating}>
                {rating} star{rating > 1 && 's'} & up
              </option>
            ))}
        </select>
      </div>
    </div>
    <div className="md:col-span-3">
    <div className="mb-5 flex items-center justify-between border-b-2 pb-2">
  <div className="flex items-center text-gray-600 dark:text-gray-300">
    {products.length === 0 ? 'No' : countProducts} Results
    {query !== 'all' && query !== '' && (
      <>
        <span className="mx-1">&middot;</span>
        <span>{query}</span>
      </>
    )}
    {category !== 'all' && (
      <>
        <span className="mx-1">&middot;</span>
        <span>{category}</span>
      </>
    )}
    {brand !== 'all' && (
      <>
        <span className="mx-1">&middot;</span>
        <span>{brand}</span>
      </>
    )}
    {price !== 'all' && (
      <>
        <span className="mx-1">&middot;</span>
        <span>{`Price ${price}`}</span>
      </>
    )}
    {rating !== 'all' && (
      <>
        <span className="mx-1">&middot;</span>
        <span>{`Rating ${rating} & up`}</span>
      </>
    )}
    {(query !== 'all' && query !== '') ||
    category !== 'all' ||
    brand !== 'all' ||
    rating !== 'all' ||
    price !== 'all' ? (
      <button
        onClick={() => router.push('/search')}
        className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
      >
        <XCircleIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      </button>
    ) : null}
  </div>
  <div>
    <span className="text-gray-600 dark:text-gray-300">Sort by</span>{' '}
    <select
      value={sort}
      onChange={sortHandler}
      className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-md p-1 pl-2 pr-6 text-gray-600 dark:text-gray-300 appearance-none hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200"
    >
      <option value="lowest">Price: Low to High</option>
      <option value="highest">Price: High to Low</option>
      <option value="toprated">Customer Reviews</option>
    </select>
  </div>
</div>
<div>
  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
    {products.map((product) => (
      <ProductItem
        key={product._id}
        product={product}
        addToCartHandler={addToCartHandler}
      />
    ))}
  </div>
  <ul className="flex justify-center mt-8">
    {products.length > 0 &&
      [...Array(pages).keys()].map((pageNumber) => (
        <li key={pageNumber}>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              page === pageNumber + 1
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            } transition-colors duration-200`}
            onClick={() => pageHandler(pageNumber + 1)}
          >
            {pageNumber + 1}
          </button>
        </li>
                ))}
            </ul>
          </div>
        </div>
      </div> 
    </Layout>

  );
}

export async function getServerSideProps({ query }) {
  const pageSize = query.pageSize || PAGE_SIZE;
  const page = query.page || 1;
  const category = query.category || '';
  const brand = query.brand || '';
  const price = query.price || '';
  const rating = query.rating || '';
  const sort = query.sort || '';
  const searchQuery = query.query || '';

  const queryFilter =
    searchQuery && searchQuery !== 'all'
      ? {
          name: {
            $regex: searchQuery,
            $options: 'i',
          },
        }
      : {};
  const categoryFilter = category && category !== 'all' ? { category } : {};
  const brandFilter = brand && brand !== 'all' ? { brand } : {};
  const ratingFilter =
    rating && rating !== 'all'
      ? {
          rating: {
            $gte: Number(rating),
          },
        }
      : {};
  // 10-50
  const priceFilter =
    price && price !== 'all'
      ? {
          price: {
            $gte: Number(price.split('-')[0]),
            $lte: Number(price.split('-')[1]),
          },
        }
      : {};
  const order =
    sort === 'featured'
      ? { isFeatured: -1 }
      : sort === 'lowest'
      ? { price: 1 }
      : sort === 'highest'
      ? { price: -1 }
      : sort === 'toprated'
      ? { rating: -1 }
      : sort === 'newest'
      ? { createdAt: -1 }
      : { _id: -1 };

  await db.connect();
  const categories = await Product.find().distinct('category');
  const brands = await Product.find().distinct('brand');
  const productDocs = await Product.find(
    {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...brandFilter,
      ...ratingFilter,
    },
    '-reviews'
  )
    .sort(order)
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .lean();

  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...brandFilter,
    ...ratingFilter,
  });

  await db.disconnect();
  const products = productDocs.map(db.convertDocToObj);

  return {
    props: {
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
      categories,
      brands,
    },
  };
}
