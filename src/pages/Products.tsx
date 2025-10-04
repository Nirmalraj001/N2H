import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product, Category } from '../types';
import { productsAPI, categoriesAPI } from '../services/api';
import { ProductGrid } from '../components/products/ProductGrid';
import { FilterPanel } from '../components/products/FilterPanel';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../components/ui/Toast';
import { Select } from '../components/ui/Select';
import { SlidersHorizontal } from 'lucide-react';

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart, cart, updateQuantity } = useCart();
  const { showToast } = useToast();

  const categoryParams = searchParams.getAll('category');
  const searchQuery = searchParams.get('search') || undefined;
  const sortParam = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await categoriesAPI.getAll();
        setCategories(cats);
      } catch (error) {
        showToast('Failed to load categories', 'error');
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        let prods = await productsAPI.getAll({
          search: searchQuery,
          sort: sortParam,
          minPrice,
          maxPrice,
        });

        if (categoryParams.length > 0) {
          prods = prods.filter(p => categoryParams.includes(p.category));
        }

        setProducts(prods);
      } catch (error) {
        showToast('Failed to load products', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [categoryParams.join(','), searchQuery, sortParam, minPrice, maxPrice]);

  const updateParams = (updates: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  const handleCategoryChange = (categoryIds: string[]) => {
    const newParams = new URLSearchParams();

    searchParams.forEach((value, key) => {
      if (key !== 'category') {
        newParams.set(key, value);
      }
    });

    categoryIds.forEach(id => {
      newParams.append('category', id);
    });

    setSearchParams(newParams);
  };

  const handlePriceChange = (min?: number, max?: number) => {
    updateParams({
      minPrice: min?.toString(),
      maxPrice: max?.toString(),
    });
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  const handleAddToCart = (productId: string, quantity: number) => {
    if (quantity > 0) {
      addToCart(productId, quantity);
      showToast('Added to cart', 'success');
    } else if (quantity < 0) {
      const currentItem = cart.find(item => item.productId === productId);
      if (currentItem) {
        const newQty = currentItem.quantity + quantity;
        if (newQty > 0) {
          updateQuantity(productId, newQty);
        }
      }
    }
  };

  const selectedCategories = categories.filter(c => categoryParams.includes(c.id));
  const categoryNames = selectedCategories.map(c => c.name).join(', ');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {categoryNames ? categoryNames : searchQuery ? `Search: "${searchQuery}"` : 'All Products'}
        </h1>
        <p className="text-gray-600 mt-2">{products.length} products found</p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filters
        </button>

        <div className="flex-1">
          <Select
            options={[
              { value: 'newest', label: 'Newest First' },
              { value: 'price_asc', label: 'Price: Low to High' },
              { value: 'price_desc', label: 'Price: High to Low' },
              { value: 'name_asc', label: 'Name: A to Z' },
              { value: 'rating', label: 'Highest Rated' },
            ]}
            value={sortParam}
            onChange={e => updateParams({ sort: e.target.value })}
            className="max-w-xs"
          />
        </div>
      </div>

      <div className="flex gap-8">
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
          <FilterPanel
            categories={categories}
            selectedCategories={categoryParams}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onCategoryChange={handleCategoryChange}
            onPriceChange={handlePriceChange}
            onClear={handleClearFilters}
          />
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <ProductGrid products={products} onAddToCart={handleAddToCart} />
          )}
        </div>
      </div>
    </div>
  );
};
