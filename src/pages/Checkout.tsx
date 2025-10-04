import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import { ordersAPI } from '../services/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { CheckCircle } from 'lucide-react';

export const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [formData, setFormData] = useState({
    street: user?.address?.[0]?.street || '',
    city: user?.address?.[0]?.city || '',
    state: user?.address?.[0]?.state || '',
    zipCode: user?.address?.[0]?.zipCode || '',
    country: user?.address?.[0]?.country || 'India',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const order = await ordersAPI.create({
        userId: user.id,
        products: cart.map(item => ({
          productId: item.productId,
          productName: 'Product',
          quantity: item.quantity,
          price: 0,
        })),
        status: 'pending',
        totalPrice: cartTotal,
        shippingAddress: {
          id: '1',
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          isDefault: true,
        },
      });

      setOrderId(order.id);
      clearCart();
      setStep(3);
      showToast('Order placed successfully!', 'success');
    } catch (error) {
      showToast('Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && step !== 3) {
    navigate('/cart');
    return null;
  }

  if (step === 3) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 mb-2">Thank you for your order</p>
        <p className="text-gray-600 mb-8">Order ID: {orderId}</p>
        <div className="space-x-4">
          <Button onClick={() => navigate('/orders')}>View Orders</Button>
          <Button variant="outline" onClick={() => navigate('/products')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="flex justify-between mb-8">
        {[1, 2].map(s => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {s}
            </div>
            <span className={`ml-2 ${step >= s ? 'text-gray-900' : 'text-gray-500'}`}>
              {s === 1 ? 'Shipping' : 'Payment'}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <Input
              label="Street Address"
              required
              value={formData.street}
              onChange={e => setFormData({ ...formData, street: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                required
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
              />
              <Input
                label="State"
                required
                value={formData.state}
                onChange={e => setFormData({ ...formData, state: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="ZIP Code"
                required
                value={formData.zipCode}
                onChange={e => setFormData({ ...formData, zipCode: e.target.value })}
              />
              <Input
                label="Country"
                required
                value={formData.country}
                onChange={e => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
            <Button type="button" onClick={() => setStep(2)} fullWidth>
              Continue to Payment
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
            <Input
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              required
              value={formData.cardNumber}
              onChange={e => setFormData({ ...formData, cardNumber: e.target.value })}
            />
            <Input
              label="Cardholder Name"
              required
              value={formData.cardName}
              onChange={e => setFormData({ ...formData, cardName: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry Date"
                placeholder="MM/YY"
                required
                value={formData.expiryDate}
                onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
              />
              <Input
                label="CVV"
                placeholder="123"
                required
                value={formData.cvv}
                onChange={e => setFormData({ ...formData, cvv: e.target.value })}
              />
            </div>

            <div className="border-t pt-4 mt-6">
              <div className="flex justify-between text-xl font-bold mb-4">
                <span>Total Amount</span>
                <span>₹{cartTotal}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => setStep(1)} fullWidth>
                Back
              </Button>
              <Button type="submit" disabled={loading} fullWidth>
                {loading ? 'Processing...' : 'Place Order'}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
