import { User, Category, Product, Order } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@n2h.com',
    role: 'admin',
    address: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'user@example.com',
    role: 'user',
    address: [
      {
        id: 'a1',
        street: '123 Main St',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India',
        isDefault: true,
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

export const mockCategories: Category[] = [
  {
    id: 'c1',
    name: 'Dry Powders',
    slug: 'dry-powders',
    description: 'Premium quality spice powders',
    image: 'https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'c2',
    name: 'Masala Blends',
    slug: 'masala',
    description: 'Traditional Indian masala blends',
    parentCategory: 'c1',
    image: 'https://images.pexels.com/photos/4198939/pexels-photo-4198939.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'c3',
    name: 'Snacks',
    slug: 'snacks',
    description: 'Delicious traditional snacks',
    image: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'c4',
    name: 'Tea Varieties',
    slug: 'tea',
    description: 'Premium tea collections',
    image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Premium Garam Masala',
    description: 'Authentic blend of aromatic spices perfect for Indian cuisine. Made with carefully selected ingredients.',
    category: 'c2',
    price: 299,
    stock: 50,
    images: [
      'https://images.pexels.com/photos/4198939/pexels-photo-4198939.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/4198843/pexels-photo-4198843.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    tags: ['spices', 'masala', 'indian'],
    rating: 4.5,
    reviews: 128,
    variants: [
      { id: 'v1', name: 'Weight', options: ['100g', '250g', '500g'] },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p2',
    name: 'Red Chilli Powder',
    description: 'Pure and fiery red chilli powder with no additives. Perfect heat for your dishes.',
    category: 'c1',
    price: 199,
    stock: 75,
    images: [
      'https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    tags: ['spices', 'chilli', 'hot'],
    rating: 4.8,
    reviews: 95,
    variants: [
      { id: 'v2', name: 'Weight', options: ['100g', '250g', '500g', '1kg'] },
      { id: 'v3', name: 'Heat Level', options: ['Medium', 'Hot', 'Extra Hot'] },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p3',
    name: 'Turmeric Powder',
    description: 'Golden turmeric powder with rich color and aroma. Known for its health benefits.',
    category: 'c1',
    price: 149,
    stock: 100,
    images: [
      'https://images.pexels.com/photos/4198881/pexels-photo-4198881.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    tags: ['spices', 'turmeric', 'healthy'],
    rating: 4.6,
    reviews: 210,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p4',
    name: 'Masala Chai Mix',
    description: 'Traditional chai masala blend with cardamom, ginger, and cinnamon.',
    category: 'c4',
    price: 249,
    stock: 60,
    images: [
      'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    tags: ['tea', 'chai', 'masala'],
    rating: 4.7,
    reviews: 156,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p5',
    name: 'Namkeen Mix',
    description: 'Crunchy and savory traditional Indian snack mix.',
    category: 'c3',
    price: 179,
    stock: 40,
    images: [
      'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    tags: ['snacks', 'namkeen', 'savory'],
    rating: 4.4,
    reviews: 89,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p6',
    name: 'Coriander Powder',
    description: 'Freshly ground coriander powder with authentic taste.',
    category: 'c1',
    price: 129,
    stock: 85,
    images: [
      'https://images.pexels.com/photos/4198933/pexels-photo-4198933.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    tags: ['spices', 'coriander'],
    rating: 4.5,
    reviews: 67,
    createdAt: new Date().toISOString(),
  },
];

export const mockOrders: Order[] = [
  {
    id: 'o1',
    userId: '2',
    products: [
      {
        productId: 'p1',
        productName: 'Premium Garam Masala',
        quantity: 2,
        price: 299,
        image: mockProducts[0].images[0],
      },
    ],
    status: 'delivered',
    totalPrice: 598,
    shippingAddress: mockUsers[1].address![0],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
