import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, Package, Truck, Shield, Plus, Minus } from 'lucide-react';
import { Product } from '../types';
import { productsAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { ProductGrid } from '../components/products/ProductGrid';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showQuantityToggle, setShowQuantityToggle] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'details'>('description');
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const { addToCart, cart, updateQuantity } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const prod = await productsAPI.getById(id);
        if (prod) {
          setProduct(prod);
          const cartItem = cart.find(item => item.productId === prod.id);
          if (cartItem) {
            setQuantity(cartItem.quantity);
            setShowQuantityToggle(true);
          }

          const allProducts = await productsAPI.getAll({});
          const related = allProducts
            .filter(p => p.id !== prod.id && (p.category === prod.category || p.tags.some(tag => prod.tags.includes(tag))))
            .slice(0, 4);
          setSuggestedProducts(related);
        } else {
          showToast('Product not found', 'error');
          navigate('/products');
        }
      } catch (error) {
        showToast('Failed to load product', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id, cart]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product.id, quantity);
    setShowQuantityToggle(true);
    showToast(`Added ${quantity} item(s) to cart`, 'success');
  };

  const handleIncrement = () => {
    if (!product) return;
    if (quantity < product.stock) {
      const newQty = quantity + 1;
      setQuantity(newQty);
      if (showQuantityToggle) {
        addToCart(product.id, 1);
      }
    }
  };

  const handleDecrement = () => {
    if (!product) return;
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      if (showQuantityToggle) {
        const currentItem = cart.find(item => item.productId === product.id);
        if (currentItem) {
          updateQuantity(product.id, newQty);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-blue-600' : 'border-transparent'
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="sticky top-24 self-start">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            {product.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{product.rating}</span>
                {product.reviews && (
                  <span className="text-gray-500">({product.reviews} reviews)</span>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {product.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div className="border-t border-b border-gray-200 py-6 mb-6">
            <div className="text-4xl font-bold text-gray-900 mb-2">₹{product.price}</div>
            {product.stock > 0 ? (
              <p className="text-green-600 font-medium">In Stock ({product.stock} available)</p>
            ) : (
              <p className="text-red-600 font-medium">Out of Stock</p>
            )}
          </div>

          <div className="space-y-4 mb-6">
            {!showQuantityToggle ? (
              <Button
                size="lg"
                fullWidth
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={handleDecrement}
                    className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-3xl font-bold w-20 text-center">{quantity}</span>
                  <button
                    onClick={handleIncrement}
                    className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-center text-sm text-gray-600 mt-2">In cart: {quantity} items</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-200">
            <div className="text-center">
              <Package className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-xs text-gray-600">Premium Quality</p>
            </div>
            <div className="text-center">
              <Truck className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-xs text-gray-600">Fast Delivery</p>
            </div>
            <div className="text-center">
              <Shield className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-xs text-gray-600">Secure Payment</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex gap-6 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-4 font-medium transition-colors ${
              activeTab === 'description'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-4 font-medium transition-colors ${
              activeTab === 'details'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Details
          </button>
        </div>

        {activeTab === 'description' ? (
          <div>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex">
              <span className="font-medium text-gray-700 w-32">Product ID:</span>
              <span className="text-gray-600">{product.id}</span>
            </div>
            <div className="flex">
              <span className="font-medium text-gray-700 w-32">Category:</span>
              <span className="text-gray-600">{product.category}</span>
            </div>
            <div className="flex">
              <span className="font-medium text-gray-700 w-32">Stock:</span>
              <span className="text-gray-600">{product.stock} units</span>
            </div>
            <div className="flex">
              <span className="font-medium text-gray-700 w-32">Tags:</span>
              <span className="text-gray-600">{product.tags.join(', ')}</span>
            </div>
          </div>
        )}
      </div>

      {suggestedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
          <ProductGrid
            products={suggestedProducts}
            onAddToCart={(productId, qty) => {
              addToCart(productId, qty);
              showToast('Added to cart', 'success');
            }}
          />
        </div>
      )}
    </div>
  );
};
