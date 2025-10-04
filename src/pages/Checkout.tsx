import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import { ordersAPI } from '../services/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { CheckCircle, CreditCard, Smartphone, Tag } from 'lucide-react';

export const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  const mockCoupons = [
    { code: 'SAVE10', discount: 10 },
    { code: 'SAVE20', discount: 20 },
    { code: 'FIRST50', discount: 50 },
  ];

  const discount = appliedCoupon ? (cartTotal * appliedCoupon.discount) / 100 : 0;
  const finalTotal = cartTotal - discount;

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
    upiId: '',
  });

  const handleApplyCoupon = () => {
    const coupon = mockCoupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
    if (coupon) {
      setAppliedCoupon(coupon);
      setCouponError('');
      showToast(`Coupon applied! ${coupon.discount}% off`, 'success');
    } else {
      setCouponError('Invalid coupon code');
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

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
        totalPrice: finalTotal,
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
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <h2 className="text-xl font-semibold mb-4">Apply Coupon</h2>
              {!appliedCoupon ? (
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={e => {
                        setCouponCode(e.target.value);
                        setCouponError('');
                      }}
                    />
                    {couponError && <p className="text-red-600 text-sm mt-1">{couponError}</p>}
                  </div>
                  <Button type="button" onClick={handleApplyCoupon}>
                    <Tag className="w-4 h-4 mr-2" />
                    Apply
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg">
                  <div>
                    <p className="font-semibold text-green-800">{appliedCoupon.code}</p>
                    <p className="text-sm text-green-600">{appliedCoupon.discount}% discount applied</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={handleRemoveCoupon}>
                    Remove
                  </Button>
                </div>
              )}
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">Available coupons:</p>
                <ul className="space-y-1">
                  {mockCoupons.map(c => (
                    <li key={c.code}>
                      <span className="font-mono font-semibold">{c.code}</span> - {c.discount}% off
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center justify-center gap-2 p-4 border-2 rounded-lg transition-all ${
                    paymentMethod === 'card'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="font-medium">Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex items-center justify-center gap-2 p-4 border-2 rounded-lg transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  <span className="font-medium">UPI</span>
                </button>
              </div>

              {paymentMethod === 'card' ? (
                <div className="space-y-4">
                  <Input
                    label="Card Number"
                    placeholder="1234 5678 9012 3456"
                    required
                    maxLength={19}
                    value={formData.cardNumber}
                    onChange={e => {
                      const value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
                      setFormData({ ...formData, cardNumber: value });
                    }}
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
                      maxLength={5}
                      value={formData.expiryDate}
                      onChange={e => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + '/' + value.slice(2, 4);
                        }
                        setFormData({ ...formData, expiryDate: value });
                      }}
                    />
                    <Input
                      label="CVV"
                      placeholder="123"
                      required
                      maxLength={3}
                      value={formData.cvv}
                      onChange={e => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '') })}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Input
                    label="UPI ID"
                    placeholder="yourname@upi"
                    required
                    value={formData.upiId}
                    onChange={e => setFormData({ ...formData, upiId: e.target.value })}
                  />
                  <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                    <p className="font-medium mb-1">Supported UPI Apps:</p>
                    <p>Google Pay, PhonePe, Paytm, BHIM, and more</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon.discount}%)</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between text-xl font-bold">
                  <span>Total Amount</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
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
          </div>
        )}
      </form>
    </div>
  );
};
