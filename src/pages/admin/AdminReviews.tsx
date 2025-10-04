import { useState } from 'react';
import { Review } from '../../types';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { useToast } from '../../components/ui/Toast';
import { Star, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

const mockReviews: Review[] = [
  {
    id: '1',
    productId: 'p1',
    userId: '2',
    userName: 'John Doe',
    rating: 5,
    title: 'Excellent Quality!',
    comment: 'The spices are fresh and aromatic. Highly recommend this product.',
    verifiedPurchase: true,
    helpfulCount: 12,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    productId: 'p1',
    userId: '3',
    userName: 'Jane Smith',
    rating: 4,
    title: 'Good product',
    comment: 'Nice flavor, but packaging could be better.',
    verifiedPurchase: true,
    helpfulCount: 8,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    productId: 'p2',
    userId: '4',
    userName: 'Mike Johnson',
    rating: 5,
    title: 'Perfect heat level',
    comment: 'This chilli powder is exactly what I was looking for. Great quality!',
    verifiedPurchase: false,
    helpfulCount: 5,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [filterRating, setFilterRating] = useState<string>('all');
  const [filterVerified, setFilterVerified] = useState<string>('all');
  const { showToast } = useToast();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      setReviews(reviews.filter(r => r.id !== id));
      showToast('Review deleted successfully', 'success');
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (filterRating !== 'all' && review.rating !== parseInt(filterRating)) {
      return false;
    }
    if (filterVerified === 'verified' && !review.verifiedPurchase) {
      return false;
    }
    if (filterVerified === 'unverified' && review.verifiedPurchase) {
      return false;
    }
    return true;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0
      ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
      : 0,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Review Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
          <p className="text-3xl font-bold text-gray-900">{reviews.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-1">Average Rating</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-gray-900">{averageRating}</p>
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-1">Verified Purchases</p>
          <p className="text-3xl font-bold text-green-600">
            {reviews.filter(r => r.verifiedPurchase).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-1">This Month</p>
          <p className="text-3xl font-bold text-blue-600">
            {reviews.filter(r => {
              const reviewDate = new Date(r.createdAt);
              const now = new Date();
              return reviewDate.getMonth() === now.getMonth() &&
                     reviewDate.getFullYear() === now.getFullYear();
            }).length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h2>
        <div className="space-y-2">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-20">
                <span className="text-sm font-medium">{rating}</span>
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <Select
            value={filterRating}
            onChange={e => setFilterRating(e.target.value)}
            className="w-40"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </Select>
          <Select
            value={filterVerified}
            onChange={e => setFilterVerified(e.target.value)}
            className="w-48"
          >
            <option value="all">All Reviews</option>
            <option value="verified">Verified Purchases</option>
            <option value="unverified">Unverified</option>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredReviews.map(review => (
          <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold text-gray-900">{review.userName}</span>
                  {review.verifiedPurchase && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified Purchase
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-1">{renderStars(review.rating)}</div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {review.title && (
                  <h3 className="font-medium text-gray-900 mb-1">{review.title}</h3>
                )}
                <p className="text-gray-700">{review.comment}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                  <span>{review.helpfulCount} people found this helpful</span>
                  <span className="text-gray-400">•</span>
                  <span className="font-mono text-xs">Product ID: {review.productId}</span>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(review.id)}
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No reviews found matching your filters.</p>
        </div>
      )}
    </div>
  );
};
