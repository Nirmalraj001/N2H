import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { useCart } from '../../contexts/CartContext';

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (productId: string, quantity: number) => void;
}

export const ProductGrid = ({ products, onAddToCart }: ProductGridProps) => {
  const { cart } = useCart();
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => {
        const cartItem = cart.find(item => item.productId === product.id);
        return (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            cartQuantity={cartItem?.quantity || 0}
          />
        );
      })}
    </div>
  );
};
