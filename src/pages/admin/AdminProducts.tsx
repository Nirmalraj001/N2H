import { useEffect, useState } from 'react';
import { CreditCard as Edit, Trash2, Plus } from 'lucide-react';
import { Product, Category } from '../../types';
import { productsAPI, categoriesAPI } from '../../services/api';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';

export const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: 0,
    stock: 0,
    images: '',
    tags: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([productsAPI.getAll(), categoriesAPI.getAll()]);
      setProducts(prods);
      setCategories(cats);
    } catch (error) {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        stock: product.stock,
        images: product.images.join(', '),
        tags: product.tags.join(', '),
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        category: categories[0]?.id || '',
        price: 0,
        stock: 0,
        images: '',
        tags: '',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: formData.price,
        stock: formData.stock,
        images: formData.images.split(',').map(s => s.trim()),
        tags: formData.tags.split(',').map(s => s.trim()),
      };

      if (editingProduct) {
        await productsAPI.update(editingProduct.id, productData);
        showToast('Product updated successfully', 'success');
      } else {
        await productsAPI.create(productData);
        showToast('Product created successfully', 'success');
      }

      setShowModal(false);
      loadData();
    } catch (error) {
      showToast('Failed to save product', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productsAPI.delete(id);
      showToast('Product deleted successfully', 'success');
      loadData();
    } catch (error) {
      showToast('Failed to delete product', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded" />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">₹{product.price}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.stock}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleOpenModal(product)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Product Name"
            required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
          <Textarea
            label="Description"
            required
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
          <Select
            label="Category"
            required
            options={categories.map(c => ({ value: c.id, label: c.name }))}
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price"
              type="number"
              required
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
            />
            <Input
              label="Stock"
              type="number"
              required
              value={formData.stock}
              onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
            />
          </div>
          <Input
            label="Images (comma separated URLs)"
            required
            value={formData.images}
            onChange={e => setFormData({ ...formData, images: e.target.value })}
          />
          <Input
            label="Tags (comma separated)"
            required
            value={formData.tags}
            onChange={e => setFormData({ ...formData, tags: e.target.value })}
          />
          <div className="flex gap-3">
            <Button type="submit" fullWidth>
              {editingProduct ? 'Update' : 'Create'}
            </Button>
            <Button type="button" variant="outline" fullWidth onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
