import React, { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import Product from '../components/Product';
import apiService from '../services/api';
import { toast } from 'react-toastify';
import { getProductCategories ,getProducts} from '../services/operations/productApi';
import { useDispatch } from 'react-redux';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: ''
  });

  const dispatch = useDispatch();

  async function fetchProductData() {
    setLoading(true);
    // try {
    //   console.log('jjjhdg');
    //   const response = await apiService.getProducts(filters);
    //   console.log('jjjhdg');
    //   if (response.success) {
    //     setProducts(response.data);
    //   }
    // } catch (error) {
    //   console.error('Error fetching products:', error);
    //   toast.error('Failed to load products');
    //   setProducts([]);
    // }
    await getProducts(filters,setProducts)
    setLoading(false);
  }

  async function fetchCategories() {
    try {
      await getProductCategories(setCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  useEffect(() => {
    fetchProductData();
    fetchCategories();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sort: ''
    });
  };

  return (
    <div className="w-11/12 max-w-[1150px] mx-auto mt-[20px]">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Category */}
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Min Price */}
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Max Price */}
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Sort */}
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {/* Clear Filters */}
        <div className="mt-4">
          <button
            onClick={clearFilters}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex flex-wrap justify-center items-center">
        {loading ? (
          <Spinner />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full p-2 mx-auto space-y-10 space-x-5 ">
            {products.map((product) => (
              <Product key={product._id} post={product}   />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;