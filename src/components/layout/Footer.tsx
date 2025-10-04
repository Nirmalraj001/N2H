import { Link } from 'react-router-dom';
import { Package, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Package className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold text-white">N2H Enterprises</span>
            </Link>
            <p className="text-sm">
              Premium quality spices, tea, and traditional snacks delivered to your doorstep.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">
                  Orders
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products?category=c1" className="hover:text-white transition-colors">
                  Dry Powders
                </Link>
              </li>
              <li>
                <Link to="/products?category=c2" className="hover:text-white transition-colors">
                  Masala Blends
                </Link>
              </li>
              <li>
                <Link to="/products?category=c3" className="hover:text-white transition-colors">
                  Snacks
                </Link>
              </li>
              <li>
                <Link to="/products?category=c4" className="hover:text-white transition-colors">
                  Tea Varieties
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>contact@n2h.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+91 12345 67890</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} N2H Enterprises. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
