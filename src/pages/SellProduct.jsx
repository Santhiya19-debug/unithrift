import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createProduct } from '../services/productService';

const SellProduct = () => {
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
    images: [] // Now stores raw File objects
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const categories = ['Furniture', 'Electronics', 'Books & Study Material', 'Kitchen Items', 'Hostel Essentials', 'Free Items'];
  const conditions = ['new', 'like-new', 'used'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  // Handles raw File selection for multipart upload
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Enforce max 5 images limit
    if (formData.images.length + selectedFiles.length > 5) {
      alert("Maximum 5 images allowed per product.");
      return;
    }

    // Filter for valid image types and size (2MB)
    const validFiles = selectedFiles.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 2 * 1024 * 1024; // 2MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== selectedFiles.length) {
      alert("Some files were rejected. Only JPG/PNG/WEBP under 2MB are allowed.");
    }

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
    if (!formData.category) e.category = 'Select a category (mandatory)';
    if (!formData.condition) e.condition = 'Select condition (mandatory)';
    if (!formData.isFree && (!formData.price || formData.price <= 0)) e.price = 'Valid price is mandatory';
    if (!formData.location.trim()) e.location = 'Campus location is mandatory';
    if (formData.images.length === 0) e.images = 'At least one product image is mandatory';
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    // Build FormData for multipart/form-data request
    const data = new FormData();
    data.append('title', formData.name);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('condition', formData.condition);
    data.append('price', formData.isFree ? 0 : Number(formData.price));
    data.append('isFree', formData.isFree);
    data.append('location', formData.location);
    
    // Append multiple files to the 'images' field
    formData.images.forEach((file) => {
      data.append('images', file);
    });

    try {
      await createProduct(token, data); // Sends FormData
      alert('Success! Your item is now live with cloud-stored images.');
      navigate('/profile');
    } catch (err) {
      alert(err.message || 'Error saving product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 font-sans">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 font-heading">List an Item</h1>
          <p className="text-gray-500 mb-8">All fields marked with * are mandatory.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* IMAGE UPLOAD SECTION */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-heading">Product Images* (Max 5)</label>
              <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${errors.images ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-emerald-500'}`}>
                <input
                  type="file"
                  id="imageUpload"
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/*"
                  multiple // Allow multiple selection
                />
                <label htmlFor="imageUpload" className="cursor-pointer block">
                  <div className="text-emerald-700 font-bold mb-1">
                    + Add Photo
                  </div>
                  <p className="text-xs text-gray-500">JPG, PNG or WEBP under 2MB</p>
                </label>
              </div>

              {/* Preview Row (Using local URLs for raw Files) */}
              <div className="flex flex-wrap gap-3 mt-4">
                {formData.images.map((file, index) => (
                  <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt="preview" 
                      className="w-full h-full object-cover" 
                    />
                    <button 
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white text-[10px] p-1 rounded-bl"
                    >✕</button>
                  </div>
                ))}
              </div>
              {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
            </div>

            {/* Product Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 font-heading">Product Title*</label>
              <input
                type="text"
                className={`w-full p-3 border rounded-lg outline-none ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:ring-2 focus:ring-emerald-500'}`}
                placeholder="e.g. Scientific Calculator FX-991"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 font-heading">Description*</label>
              <textarea
                rows="4"
                className={`w-full p-3 border rounded-lg outline-none ${errors.description ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:ring-2 focus:ring-emerald-500'}`}
                placeholder="Mention usage time, defects, or specific features..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 font-heading">Category*</label>
                <select
                  className={`w-full p-3 border rounded-lg outline-none ${errors.category ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:ring-2 focus:ring-emerald-500'}`}
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 font-heading">Condition*</label>
                <select
                  className={`w-full p-3 border rounded-lg outline-none ${errors.condition ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:ring-2 focus:ring-emerald-500'}`}
                  value={formData.condition}
                  onChange={(e) => handleInputChange('condition', e.target.value)}
                >
                  <option value="">Select Condition</option>
                  {conditions.map(con => <option key={con} value={con}>{con}</option>)}
                </select>
                {errors.condition && <p className="text-red-500 text-xs mt-1">{errors.condition}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 font-heading">Price (₹)*</label>
                <input
                  type="number"
                  disabled={formData.isFree}
                  className={`w-full p-3 border rounded-lg outline-none disabled:bg-gray-100 ${errors.price ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:ring-2 focus:ring-emerald-500'}`}
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                />
                <div className="mt-2 flex items-center">
                  <input
                    type="checkbox"
                    id="isFree"
                    className="h-4 w-4 text-emerald-600 border-gray-300 rounded"
                    checked={formData.isFree}
                    onChange={(e) => handleInputChange('isFree', e.target.checked)}
                  />
                  <label htmlFor="isFree" className="ml-2 text-sm text-gray-600 font-medium font-heading">This item is free</label>
                </div>
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 font-heading">Campus Location*</label>
                <input
                  type="text"
                  className={`w-full p-3 border rounded-lg outline-none ${errors.location ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:ring-2 focus:ring-emerald-500'}`}
                  placeholder="e.g. Block A, Room 302"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-all shadow-lg shadow-emerald-700/20 disabled:opacity-50 font-heading"
            >
              {loading ? 'Uploading Images & Publishing...' : 'List Item Now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellProduct;