import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '../../types';
import { Button } from '../ui/Button';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link to={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>

        <div className="flex items-center gap-2 mt-2">
          {product.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.rating}</span>
              {product.reviews && (
                <span className="text-sm text-gray-500">({product.reviews})</span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          {product.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-2xl font-bold text-gray-900">₹{product.price}</p>
            {product.stock > 0 && product.stock < 10 && (
              <p className="text-xs text-orange-600">Only {product.stock} left</p>
            )}
          </div>
          {onAddToCart && (
            <Button
              size="sm"
              onClick={() => onAddToCart(product.id)}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Add
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
