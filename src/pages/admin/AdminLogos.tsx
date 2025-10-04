import { useState } from 'react';
import { SiteLogo } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { Plus, CreditCard as Edit, Trash2, CheckCircle, Circle } from 'lucide-react';

const mockLogos: SiteLogo[] = [
  {
    id: '1',
    name: 'Primary Logo',
    imageUrl: 'https://images.pexels.com/photos/4198881/pexels-photo-4198881.jpeg?auto=compress&cs=tinysrgb&w=200&h=200',
    altText: 'N2H Store Logo',
    isActive: true,
  },
];

export const AdminLogos = () => {
  const [logos, setLogos] = useState<SiteLogo[]>(mockLogos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLogo, setEditingLogo] = useState<SiteLogo | null>(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    altText: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      imageUrl: '',
      altText: '',
    });
    setEditingLogo(null);
  };

  const handleEdit = (logo: SiteLogo) => {
    setEditingLogo(logo);
    setFormData({
      name: logo.name,
      imageUrl: logo.imageUrl,
      altText: logo.altText || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingLogo) {
      setLogos(logos.map(l =>
        l.id === editingLogo.id
          ? { ...l, ...formData }
          : l
      ));
      showToast('Logo updated successfully', 'success');
    } else {
      const newLogo: SiteLogo = {
        id: Date.now().toString(),
        ...formData,
        isActive: false,
      };
      setLogos([...logos, newLogo]);
      showToast('Logo created successfully', 'success');
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    const logo = logos.find(l => l.id === id);
    if (logo?.isActive) {
      showToast('Cannot delete active logo', 'error');
      return;
    }
    if (confirm('Are you sure you want to delete this logo?')) {
      setLogos(logos.filter(l => l.id !== id));
      showToast('Logo deleted successfully', 'success');
    }
  };

  const setActiveLogo = (id: string) => {
    setLogos(logos.map(l => ({ ...l, isActive: l.id === id })));
    showToast('Active logo updated', 'success');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Logo Management</h1>
        <Button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Logo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {logos.map(logo => (
          <div
            key={logo.id}
            className={`bg-white rounded-lg shadow-md overflow-hidden transition-all ${
              logo.isActive ? 'ring-2 ring-blue-600' : ''
            }`}
          >
            <div className="aspect-video bg-gray-100 flex items-center justify-center p-8">
              <img
                src={logo.imageUrl}
                alt={logo.altText || logo.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{logo.name}</h3>
                  {logo.altText && (
                    <p className="text-sm text-gray-600 mt-1">{logo.altText}</p>
                  )}
                </div>
                {logo.isActive && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {!logo.isActive && (
                  <Button
                    size="sm"
                    onClick={() => setActiveLogo(logo.id)}
                    fullWidth
                  >
                    Set as Active
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(logo)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                {!logo.isActive && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(logo.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingLogo ? 'Edit Logo' : 'Add New Logo'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Logo Name"
            required
            placeholder="Primary Logo"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Image URL"
            required
            placeholder="https://example.com/logo.png"
            value={formData.imageUrl}
            onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
          />
          {formData.imageUrl && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <div className="bg-white p-4 rounded flex items-center justify-center" style={{ height: '150px' }}>
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/200x200?text=Invalid+Image+URL';
                  }}
                />
              </div>
            </div>
          )}
          <Input
            label="Alt Text (for accessibility)"
            placeholder="Company Logo"
            value={formData.altText}
            onChange={e => setFormData({ ...formData, altText: e.target.value })}
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
              {editingLogo ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
