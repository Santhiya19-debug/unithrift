import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { categories, locations, conditions } from '../data/mockProducts';

const SellProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    condition: '',
    price: '',
    isFree: false,
    location: '',
    images: []
  });

  const [errors, setErrors] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imagePreviews.length > 5) {
      setErrors(prev => ({ ...prev, images: 'Maximum 5 images allowed' }));
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.condition) newErrors.condition = 'Please select condition';
    if (!formData.isFree && !formData.price) newErrors.price = 'Please enter a price or mark as free';
    if (!formData.location) newErrors.location = 'Please select pickup location';
    if (imagePreviews.length === 0) newErrors.images = 'Please upload at least one image';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Mock submission - in real app, this would call API
      console.log('Product submitted:', formData);
      alert('Product listed successfully!');
      navigate('/profile');
    }
  };

  return (
    <div className="min-h-screen bg-off-white py-8 md:py-12">
      <div className="container-custom max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-medium text-text-primary mb-2">
            List Your Item
          </h1>
          <p className="text-text-secondary">
            Fill in the details to create your listing
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-card p-6 md:p-8 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Product Images <span className="text-error">*</span>
            </label>
            <p className="text-sm text-text-muted mb-3">Upload up to 5 images</p>
            
            {/* Image Previews */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full shadow-card flex items-center justify-center hover:bg-error hover:text-white transition-colors duration-card"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              
              {/* Upload Button */}
              {imagePreviews.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-border-soft rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-sage transition-colors duration-card">
                  <svg className="w-8 h-8 text-text-muted mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-sm text-text-muted">Add Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            
            {errors.images && <p className="text-sm text-error">{errors.images}</p>}
          </div>

          {/* Product Name */}
          <Input
            label="Product Name"
            placeholder="e.g., Study Desk with Chair"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
            error={errors.name}
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Description <span className="text-error">*</span>
            </label>
            <textarea
              placeholder="Describe your item in detail..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={`input-field ${errors.description ? 'border-error' : ''}`}
            />
            {errors.description && <p className="mt-1 text-sm text-error">{errors.description}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Category <span className="text-error">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className={`input-field ${errors.category ? 'border-error' : ''}`}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-error">{errors.category}</p>}
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Condition <span className="text-error">*</span>
            </label>
            <div className="flex gap-3">
              {conditions.map(cond => (
                <label key={cond} className="flex-1">
                  <input
                    type="radio"
                    name="condition"
                    value={cond}
                    checked={formData.condition === cond}
                    onChange={(e) => handleInputChange('condition', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`p-3 border-2 rounded-lg text-center cursor-pointer transition-colors duration-card ${
                    formData.condition === cond 
                      ? 'border-sage bg-sage bg-opacity-5 text-green-dark' 
                      : 'border-border-soft text-text-secondary hover:border-sage-muted'
                  }`}>
                    {cond}
                  </div>
                </label>
              ))}
            </div>
            {errors.condition && <p className="mt-1 text-sm text-error">{errors.condition}</p>}
          </div>

          {/* Price or Free */}
          <div>
            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={formData.isFree}
                onChange={(e) => handleInputChange('isFree', e.target.checked)}
                className="w-4 h-4 text-sage rounded focus:ring-sage"
              />
              <span className="text-sm font-medium text-text-primary">
                This item is free
              </span>
            </label>

            {!formData.isFree && (
              <Input
                label="Price"
                type="number"
                placeholder="Enter price in ₹"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                error={errors.price}
              />
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Pickup Location <span className="text-error">*</span>
            </label>
            <select
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className={`input-field ${errors.location ? 'border-error' : ''}`}
            >
              <option value="">Select pickup location</option>
              {locations.map((loc, index) => (
                <option key={index} value={loc}>{loc}</option>
              ))}
            </select>
            {errors.location && <p className="mt-1 text-sm text-error">{errors.location}</p>}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              List Item
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellProduct;