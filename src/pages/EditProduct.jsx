import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProductById, updateProduct } from '../services/productService';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    condition: '',
    price: '',
    isFree: false,
    location: '',
    images: [] // Will contain a mix of Cloudinary URLs and raw File objects
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const categories = ['Furniture', 'Electronics', 'Books & Study Material', 'Kitchen Items', 'Hostel Essentials', 'Free Items'];
  const conditions = ['new', 'like-new', 'used'];

  useEffect(() => {
    const loadProductData = async () => {
      try {
        const product = await getProductById(id);
        setFormData({
          name: product.title || product.name,
          description: product.description,
          category: product.category,
          condition: product.condition,
          price: product.price,
          isFree: product.isFree,
          location: product.location,
          images: product.images || [] // Existing Cloudinary URLs
        });
      } catch (err) {
        alert("Failed to load product data");
        navigate('/profile');
      } finally {
        setLoading(false);
      }
    };
    if (id) loadProductData();
  }, [id, navigate]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (formData.images.length + selectedFiles.length > 5) {
      alert("Maximum 5 images allowed.");
      return;
    }

    const validFiles = selectedFiles.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 2 * 1024 * 1024;
      return isValidType && isValidSize;
    });

    setFormData(prev => ({ 
      ...prev, 
      images: [...prev.images, ...validFiles] 
    }));
    if (errors.images) setErrors(prev => ({ ...prev, images: null }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Product name is mandatory';
    if (!formData.description.trim()) e.description = 'Description is mandatory';
    if (!formData.category) e.category = 'Category is mandatory';
    if (!formData.condition) e.condition = 'Condition is mandatory';
    if (!formData.isFree && (!formData.price || formData.price < 0)) e.price = 'Valid price is mandatory';
    if (!formData.location.trim()) e.location = 'Location is mandatory';
    if (formData.images.length === 0) e.images = 'At least one image is mandatory';
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    
    // BUILD FORMDATA
    const data = new FormData();
    data.append('title', formData.name);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('condition', formData.condition);
    data.append('price', formData.isFree ? 0 : Number(formData.price));
    data.append('isFree', formData.isFree);
    data.append('location', formData.location);

    // Identify which images are new files and which are existing URLs
    const existingUrls = [];
    formData.images.forEach(img => {
      if (img instanceof File) {
        data.append('images', img); // New physical files
      } else {
        existingUrls.push(img); // Keep existing cloud URLs
      }
    });
    
    // We send the existing URLs as a JSON string so the backend knows what to keep
    data.append('existingImages', JSON.stringify(existingUrls));

    try {
      await updateProduct(id, token, data);
      alert('Listing updated successfully!');
      navigate('/profile');
    } catch (err) {
      alert(err.message || 'Error updating product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
      <div className="w-10 h-10 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 font-sans">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 font-heading">Edit Listing</h1>
            <button onClick={() => navigate('/profile')} className="text-gray-400 hover:text-gray-600 font-medium">Cancel</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Zone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-heading">Product Photos* (Max 5)</label>
              <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${errors.images ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-emerald-500'}`}>
                <input type="file" id="editImage" className="hidden" onChange={handleFileChange} accept="image/*" multiple />
                <label htmlFor="editImage" className="cursor-pointer block text-emerald-700 font-bold">
                  + Add Photos
                </label>
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                {formData.images.map((img, index) => {
                  const displayUrl = img instanceof File ? URL.createObjectURL(img) : img;
                  return (
                    <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border">
                      <img src={displayUrl} alt="preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(index)} className="absolute top-0 right-0 bg-red-500 text-white p-1 text-xs">✕</button>
                    </div>
                  );
                })}
              </div>
              {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 font-heading">Product Title*</label>
              <input
                type="text"
                className={`w-full p-3 border rounded-lg outline-none ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:ring-2 focus:ring-emerald-500'}`}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 font-heading">Description*</label>
              <textarea
                rows="4"
                className={`w-full p-3 border rounded-lg outline-none ${errors.description ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:ring-2 focus:ring-emerald-500'}`}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 font-heading">Category*</label>
                <select className="w-full p-3 border border-gray-200 rounded-lg outline-none" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 font-heading">Condition*</label>
                <select className="w-full p-3 border border-gray-200 rounded-lg outline-none" value={formData.condition} onChange={(e) => setFormData({...formData, condition: e.target.value})}>
                  {conditions.map(con => <option key={con} value={con}>{con}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 font-heading">Price (₹)*</label>
                <input
                  type="number"
                  disabled={formData.isFree}
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none disabled:bg-gray-100"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 font-heading">Campus Location*</label>
                <input
                  type="text"
                  className={`w-full p-3 border rounded-lg outline-none ${errors.location ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:ring-2 focus:ring-emerald-500'}`}
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-all shadow-lg shadow-emerald-700/20 disabled:opacity-50 font-heading"
            >
              {saving ? 'Uploading & Saving...' : 'Update Listing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;