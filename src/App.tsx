import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ToastProvider } from './components/ui/Toast';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ScrollToTop } from './components/ScrollToTop';
import { AppShell } from './components/layout/AppShell';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { Orders } from './pages/Orders';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminBanners } from './pages/admin/AdminBanners';
import { AdminLogos } from './pages/admin/AdminLogos';
import { AdminSiteLinks } from './pages/admin/AdminSiteLinks';
import { AdminReviews } from './pages/admin/AdminReviews';
import { Reviews } from './pages/Reviews';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route
                path="/"
                element={
                  <AppShell>
                    <Home />
                  </AppShell>
                }
              />
              <Route
                path="/products"
                element={
                  <AppShell>
                    <Products />
                  </AppShell>
                }
              />
              <Route
                path="/products/:id"
                element={
                  <AppShell>
                    <ProductDetail />
                  </AppShell>
                }
              />
              <Route
                path="/cart"
                element={
                  <AppShell>
                    <Cart />
                  </AppShell>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <Checkout />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <Profile />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <Orders />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reviews"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <Reviews />
                    </AppShell>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="banners" element={<AdminBanners />} />
                <Route path="logos" element={<AdminLogos />} />
                <Route path="site-links" element={<AdminSiteLinks />} />
                <Route path="reviews" element={<AdminReviews />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
