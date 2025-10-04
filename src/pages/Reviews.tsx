import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Modal } from '../components/ui/Modal';
import { Review } from '../types';
import { productsAPI, ordersAPI } from '../services/api';
import { Star, ThumbsUp, MessageSquare, CreditCard as Edit, Trash2 } from 'lucide-react';

export const Reviews = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [myReviews, setMyReviews] = useState<Review[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [purchasedProducts, setPurchasedProducts] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    productId: '',
    rating: 5,
    title: '',
    comment: '',
  });

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      const mockReviews: Review[] = [
        {
          id: '1',
          productId: 'p1',
          userId: user?.id || '',
          userName: user?.name || '',
          rating: 5,
          title: 'Excellent Quality!',
          comment: 'The spices are fresh and aromatic. Highly recommend this product.',
          verifiedPurchase: true,
          helpfulCount: 12,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      setMyReviews(mockReviews);

      const orders = await ordersAPI.getByUserId(user?.id || '');
      const productIds = new Set<string>();
      orders.forEach(order => {
        order.products.forEach(p => productIds.add(p.productId));
      });

      const products = await Promise.all(
        Array.from(productIds).map(id => productsAPI.getById(id))
      );
      setPurchasedProducts(products.filter(p => p !== null));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      rating: 5,
      title: '',
      comment: '',
    });
    setEditingReview(null);
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setFormData({
      productId: review.productId,
      rating: review.rating,
      title: review.title || '',
      comment: review.comment,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      if (editingReview) {
        const updatedReview: Review = {
          ...editingReview,
          ...formData,
          updatedAt: new Date().toISOString(),
        };
        setMyReviews(myReviews.map(r => r.id === editingReview.id ? updatedReview : r));
        showToast('Review updated successfully', 'success');
      } else {
        const product = purchasedProducts.find(p => p?.id === formData.productId);
        const newReview: Review = {
          id: Date.now().toString(),
          userId: user.id,
          userName: user.name,
          ...formData,
          verifiedPurchase: true,
          helpfulCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setMyReviews([newReview, ...myReviews]);
        showToast('Review submitted successfully', 'success');
      }

      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      showToast('Failed to submit review', 'error');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      setMyReviews(myReviews.filter(r => r.id !== id));
      showToast('Review deleted successfully', 'success');
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, onChange?: (rating: number) => void) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => interactive && onChange && onChange(i + 1)}
        disabled={!interactive}
        className={`${interactive ? 'cursor-pointer hover:scale-110' : ''} transition-transform`}
      >
        <Star
          className={`w-6 h-6 ${
            i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      </button>
    ));
  };

  const unreviewedProducts = purchasedProducts.filter(
    product => product && !myReviews.some(r => r.productId === product.id)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
          <p className="text-gray-600 mt-1">Share your experience with products you've purchased</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          disabled={unreviewedProducts.length === 0}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Write Review
        </Button>
      </div>

      {unreviewedProducts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-blue-900 mb-2">Products waiting for your review</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {unreviewedProducts.slice(0, 4).map(product => (
              <button
                key={product.id}
                onClick={() => {
                  setFormData({ ...formData, productId: product.id });
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow text-left"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                  <p className="text-xs text-gray-600 mt-1">Click to review</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {myReviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600 mb-4">
              Share your thoughts about the products you've purchased
            </p>
            {unreviewedProducts.length > 0 && (
              <Button
                onClick={() => {
                  resetForm();
                  setIsModalOpen(true);
                }}
              >
                Write Your First Review
              </Button>
            )}
          </div>
        ) : (
          myReviews.map(review => {
            const product = purchasedProducts.find(p => p?.id === review.productId);
            return (
              <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex gap-4">
                  {product && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {product?.name || 'Product'}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex gap-1">{renderStars(review.rating)}</div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(review)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(review.id)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                    {review.title && (
                      <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                    )}
                    <p className="text-gray-700 mb-3">{review.comment}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{review.helpfulCount} people found this helpful</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingReview ? 'Edit Review' : 'Write a Review'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingReview && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Product
              </label>
              <select
                required
                value={formData.productId}
                onChange={e => setFormData({ ...formData, productId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a product</option>
                {unreviewedProducts.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex gap-1">
              {renderStars(formData.rating, true, (rating) =>
                setFormData({ ...formData, rating })
              )}
            </div>
          </div>

          <Input
            label="Review Title (Optional)"
            placeholder="Summarize your experience"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />

          <Textarea
            label="Your Review"
            required
            rows={4}
            placeholder="Share your thoughts about this product..."
            value={formData.comment}
            onChange={e => setFormData({ ...formData, comment: e.target.value })}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              fullWidth
            >
              Cancel
            </Button>
            <Button type="submit" fullWidth>
              {editingReview ? 'Update Review' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
