import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, LogOut } from 'lucide-react';
import { supabase, Product } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function AdminPanel() {
  const { signOut, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'villa',
    price_per_day: '',
    location: '',
    capacity: '',
    features: '',
    images: '',
    name_en: '',
    description_en: '',
    location_en: '',
    features_en: '',
    category_en: '',
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setProducts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const featuresArray = formData.features.split(',').map(f => f.trim()).filter(f => f);
    const featuresEnArray = formData.features_en ? formData.features_en.split(',').map(f => f.trim()).filter(f => f) : null;
    const imagesArray = formData.images.split('\n').map(i => i.trim()).filter(i => i);

    const productData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      price_per_day: parseFloat(formData.price_per_day),
      location: formData.location,
      capacity: parseInt(formData.capacity),
      features: featuresArray,
      images: imagesArray,
      image_url: imagesArray[0] || '',
      is_active: true,
      name_en: formData.name_en || null,
      description_en: formData.description_en || null,
      location_en: formData.location_en || null,
      features_en: featuresEnArray && featuresEnArray.length > 0 ? featuresEnArray : null,
      category_en: formData.category_en || null,
    };

    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);

      if (error) {
        alert('Error updating product: ' + error.message);
      } else {
        alert('Product updated successfully!');
        resetForm();
        loadProducts();
      }
    } else {
      const { error } = await supabase
        .from('products')
        .insert([productData]);

      if (error) {
        alert('Error creating product: ' + error.message);
      } else {
        alert('Product created successfully!');
        resetForm();
        loadProducts();
      }
    }

    setLoading(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price_per_day: product.price_per_day.toString(),
      location: product.location,
      capacity: product.capacity?.toString() || '',
      features: product.features.join(', '),
      images: product.images?.join('\n') || product.image_url,
      name_en: product.name_en || '',
      description_en: product.description_en || '',
      location_en: product.location_en || '',
      features_en: product.features_en ? product.features_en.join(', ') : '',
      category_en: product.category_en || '',
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Error deleting product: ' + error.message);
    } else {
      alert('Product deleted successfully!');
      loadProducts();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'villa',
      price_per_day: '',
      location: '',
      capacity: '',
      features: '',
      images: '',
      name_en: '',
      description_en: '',
      location_en: '',
      features_en: '',
      category_en: '',
    });
    setEditingProduct(null);
    setIsFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            {user?.email && (
              <p className="text-sm text-gray-600 mt-1">Logged in as: {user.email}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition"
            >
              <Plus className="h-5 w-5" />
              <span>Add Product</span>
            </button>
            <button
              onClick={signOut}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-700 transition"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price/Day
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${product.price_per_day}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="villa">Villa</option>
                      <option value="yacht">Yacht</option>
                      <option value="car">Car</option>
                      <option value="jet">Jet</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price per Day ($)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price_per_day}
                      onChange={(e) => setFormData({ ...formData, price_per_day: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity (people)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Features (comma-separated) - Russian
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="WiFi, Бассейн, Сад, Парковка"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">English Translations (Optional)</h3>
                  <p className="text-sm text-gray-600 mb-4">Leave empty to use Russian values as fallback</p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name - English
                      </label>
                      <input
                        type="text"
                        value={formData.name_en}
                        onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                        placeholder="Optional English name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description - English
                      </label>
                      <textarea
                        rows={3}
                        value={formData.description_en}
                        onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                        placeholder="Optional English description"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location - English
                      </label>
                      <input
                        type="text"
                        value={formData.location_en}
                        onChange={(e) => setFormData({ ...formData, location_en: e.target.value })}
                        placeholder="Optional English location"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category - English
                      </label>
                      <input
                        type="text"
                        value={formData.category_en}
                        onChange={(e) => setFormData({ ...formData, category_en: e.target.value })}
                        placeholder="Optional English category (e.g., Transfer, Islands, Safari)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Features - English (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={formData.features_en}
                        onChange={(e) => setFormData({ ...formData, features_en: e.target.value })}
                        placeholder="WiFi, Pool, Garden, Parking"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URLs (one per line)
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    placeholder="https://images.pexels.com/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Add multiple images for image carousel. One URL per line.
                  </p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                  >
                    {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
