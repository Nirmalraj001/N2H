import { useState } from 'react';
import { SiteLink } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { Plus, CreditCard as Edit, Trash2, Eye, EyeOff, Link as LinkIcon } from 'lucide-react';

const mockSiteLinks: SiteLink[] = [
  { id: '1', name: 'About Us', url: '/about', category: 'footer', position: 1, isActive: true },
  { id: '2', name: 'Contact', url: '/contact', category: 'footer', position: 2, isActive: true },
  { id: '3', name: 'Privacy Policy', url: '/privacy', category: 'footer', position: 3, isActive: true },
  { id: '4', name: 'Terms of Service', url: '/terms', category: 'footer', position: 4, isActive: true },
  { id: '5', name: 'Shipping Policy', url: '/shipping', category: 'footer', position: 5, isActive: true },
];

export const AdminSiteLinks = () => {
  const [links, setLinks] = useState<SiteLink[]>(mockSiteLinks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SiteLink | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    url: '',
    category: 'footer',
    position: 0,
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      url: '',
      category: 'footer',
      position: 0,
      isActive: true,
    });
    setEditingLink(null);
  };

  const handleEdit = (link: SiteLink) => {
    setEditingLink(link);
    setFormData({
      name: link.name,
      url: link.url,
      category: link.category,
      position: link.position,
      isActive: link.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingLink) {
      setLinks(links.map(l =>
        l.id === editingLink.id ? { ...l, ...formData } : l
      ));
      showToast('Link updated successfully', 'success');
    } else {
      const newLink: SiteLink = {
        id: Date.now().toString(),
        ...formData,
      };
      setLinks([...links, newLink]);
      showToast('Link created successfully', 'success');
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this link?')) {
      setLinks(links.filter(l => l.id !== id));
      showToast('Link deleted successfully', 'success');
    }
  };

  const toggleActive = (id: string) => {
    setLinks(links.map(l =>
      l.id === id ? { ...l, isActive: !l.isActive } : l
    ));
    showToast('Link status updated', 'success');
  };

  const categories = Array.from(new Set(links.map(l => l.category)));
  const filteredLinks = filterCategory === 'all'
    ? links
    : links.filter(l => l.category === filterCategory);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Site Link Management</h1>
        <Button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Link
        </Button>
      </div>

      <div className="mb-4">
        <Select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="max-w-xs"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </Select>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLinks.sort((a, b) => a.position - b.position).map(link => (
                <tr key={link.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{link.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 font-mono">{link.url}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {link.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{link.position}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleActive(link.id)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        link.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {link.isActive ? (
                        <>
                          <Eye className="w-3 h-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(link)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(link.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingLink ? 'Edit Link' : 'Add New Link'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Link Name"
            required
            placeholder="About Us"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="URL"
            required
            placeholder="/about"
            value={formData.url}
            onChange={e => setFormData({ ...formData, url: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <Select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="header">Header</option>
              <option value="footer">Footer</option>
              <option value="sidebar">Sidebar</option>
              <option value="other">Other</option>
            </Select>
          </div>
          <Input
            label="Position"
            type="number"
            required
            min="0"
            value={formData.position}
            onChange={e => setFormData({ ...formData, position: Number(e.target.value) })}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Active</span>
          </label>
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
              {editingLink ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
