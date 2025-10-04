import { User, Product, Category, Order, CartItem, Address } from '../types';
import { mockUsers, mockProducts, mockCategories, mockOrders } from '../data/mockData';

const STORAGE_KEYS = {
  USER: 'n2h_current_user',
  CART: 'n2h_cart',
  USERS: 'n2h_users',
  PRODUCTS: 'n2h_products',
  CATEGORIES: 'n2h_categories',
  ORDERS: 'n2h_orders',
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(mockProducts));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(mockCategories));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(mockOrders));
  }
};

initializeStorage();

export const authAPI = {
  login: async (email: string, password: string): Promise<User> => {
    await delay(500);
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find(u => u.email === email);

    if (!user || password !== 'password123') {
      throw new Error('Invalid credentials');
    }

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    await delay(500);
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');

    if (users.find(u => u.email === email)) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: 'user',
      address: [],
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    return newUser;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await delay(500);
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    if (!users.find(u => u.email === email)) {
      throw new Error('Email not found');
    }
  },
};

export const productsAPI = {
  getAll: async (params?: {
    category?: string;
    search?: string;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Product[]> => {
    await delay(300);
    let products: Product[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');

    if (params?.category) {
      products = products.filter(p => p.category === params.category);
    }

    if (params?.search) {
      const search = params.search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.tags.some(t => t.toLowerCase().includes(search))
      );
    }

    if (params?.minPrice !== undefined) {
      products = products.filter(p => p.price >= params.minPrice!);
    }

    if (params?.maxPrice !== undefined) {
      products = products.filter(p => p.price <= params.maxPrice!);
    }

    if (params?.sort) {
      switch (params.sort) {
        case 'price_asc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'name_asc':
          products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'rating':
          products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'newest':
          products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
      }
    }

    return products;
  },

  getById: async (id: string): Promise<Product | null> => {
    await delay(200);
    const products: Product[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    return products.find(p => p.id === id) || null;
  },

  create: async (product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    await delay(300);
    const products: Product[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    products.push(newProduct);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return newProduct;
  },

  update: async (id: string, updates: Partial<Product>): Promise<Product> => {
    await delay(300);
    const products: Product[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');

    products[index] = { ...products[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return products[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    const products: Product[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const filtered = products.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
  },
};

export const categoriesAPI = {
  getAll: async (): Promise<Category[]> => {
    await delay(200);
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
  },

  getById: async (id: string): Promise<Category | null> => {
    await delay(200);
    const categories: Category[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
    return categories.find(c => c.id === id) || null;
  },

  create: async (category: Omit<Category, 'id'>): Promise<Category> => {
    await delay(300);
    const categories: Category[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };
    categories.push(newCategory);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    return newCategory;
  },

  update: async (id: string, updates: Partial<Category>): Promise<Category> => {
    await delay(300);
    const categories: Category[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');

    categories[index] = { ...categories[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    return categories[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    const categories: Category[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
    const filtered = categories.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));
  },
};

export const ordersAPI = {
  getAll: async (userId?: string): Promise<Order[]> => {
    await delay(300);
    let orders: Order[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');

    if (userId) {
      orders = orders.filter(o => o.userId === userId);
    }

    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getById: async (id: string): Promise<Order | null> => {
    await delay(200);
    const orders: Order[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    return orders.find(o => o.id === id) || null;
  },

  create: async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    await delay(300);
    const orders: Order[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    orders.push(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return newOrder;
  },

  updateStatus: async (id: string, status: Order['status']): Promise<Order> => {
    await delay(300);
    const orders: Order[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Order not found');

    orders[index] = { ...orders[index], status, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return orders[index];
  },
};

export const usersAPI = {
  getAll: async (): Promise<User[]> => {
    await delay(300);
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },

  getById: async (id: string): Promise<User | null> => {
    await delay(200);
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    return users.find(u => u.id === id) || null;
  },

  update: async (id: string, updates: Partial<User>): Promise<User> => {
    await delay(300);
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');

    users[index] = { ...users[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    const currentUser = authAPI.getCurrentUser();
    if (currentUser?.id === id) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(users[index]));
    }

    return users[index];
  },

  addAddress: async (userId: string, address: Omit<Address, 'id'>): Promise<User> => {
    await delay(300);
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('User not found');

    const newAddress: Address = {
      ...address,
      id: Date.now().toString(),
    };

    users[index].address = users[index].address || [];
    users[index].address.push(newAddress);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    const currentUser = authAPI.getCurrentUser();
    if (currentUser?.id === userId) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(users[index]));
    }

    return users[index];
  },

  updateAddress: async (userId: string, addressId: string, updates: Partial<Address>): Promise<User> => {
    await delay(300);
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');

    const addressIndex = users[userIndex].address?.findIndex(a => a.id === addressId);
    if (addressIndex === undefined || addressIndex === -1) throw new Error('Address not found');

    users[userIndex].address![addressIndex] = { ...users[userIndex].address![addressIndex], ...updates };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    const currentUser = authAPI.getCurrentUser();
    if (currentUser?.id === userId) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(users[userIndex]));
    }

    return users[userIndex];
  },

  deleteAddress: async (userId: string, addressId: string): Promise<User> => {
    await delay(300);
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');

    users[userIndex].address = users[userIndex].address?.filter(a => a.id !== addressId) || [];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    const currentUser = authAPI.getCurrentUser();
    if (currentUser?.id === userId) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(users[userIndex]));
    }

    return users[userIndex];
  },
};

export const cartAPI = {
  get: (): CartItem[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
  },

  add: (item: CartItem): void => {
    const cart = cartAPI.get();
    const existingIndex = cart.findIndex(i => i.productId === item.productId);

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += item.quantity;
    } else {
      cart.push(item);
    }

    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  },

  update: (productId: string, quantity: number): void => {
    const cart = cartAPI.get();
    const index = cart.findIndex(i => i.productId === productId);

    if (index >= 0) {
      if (quantity <= 0) {
        cart.splice(index, 1);
      } else {
        cart[index].quantity = quantity;
      }
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    }
  },

  remove: (productId: string): void => {
    const cart = cartAPI.get();
    const filtered = cart.filter(i => i.productId !== productId);
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(filtered));
  },

  clear: (): void => {
    localStorage.removeItem(STORAGE_KEYS.CART);
  },
};
