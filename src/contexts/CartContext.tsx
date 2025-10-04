import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '../types';
import { cartAPI, productsAPI } from '../services/api';

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: string, quantity: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  getProductDetails: (productId: string) => Promise<Product | null>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Record<string, Product>>({});

  useEffect(() => {
    setCart(cartAPI.get());
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      const productIds = cart.map(item => item.productId);
      const loadedProducts: Record<string, Product> = {};

      for (const id of productIds) {
        if (!products[id]) {
          const product = await productsAPI.getById(id);
          if (product) {
            loadedProducts[id] = product;
          }
        }
      }

      if (Object.keys(loadedProducts).length > 0) {
        setProducts(prev => ({ ...prev, ...loadedProducts }));
      }
    };

    loadProducts();
  }, [cart]);

  const addToCart = (productId: string, quantity: number) => {
    cartAPI.add({ productId, quantity });
    setCart(cartAPI.get());
  };

  const updateQuantity = (productId: string, quantity: number) => {
    cartAPI.update(productId, quantity);
    setCart(cartAPI.get());
  };

  const removeFromCart = (productId: string) => {
    cartAPI.remove(productId);
    setCart(cartAPI.get());
  };

  const clearCart = () => {
    cartAPI.clear();
    setCart([]);
  };

  const getProductDetails = async (productId: string) => {
    if (products[productId]) {
      return products[productId];
    }
    return await productsAPI.getById(productId);
  };

  const cartTotal = cart.reduce((total, item) => {
    const product = products[item.productId];
    return total + (product ? product.price * item.quantity : 0);
  }, 0);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        getProductDetails,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
