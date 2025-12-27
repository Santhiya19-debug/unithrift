import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { mockProducts } from '../data/mockProducts';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = mockProducts.find(p => p.id === parseInt(id));
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-2xl text-text-primary mb-4">Product not found</h2>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const { name, price, isFree, images, location, category, condition, description, seller } = product;

  return (
    <div className="min-h-screen bg-off-white">
      <div className="container-custom py-8 md:py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-secondary hover:text-green-dark transition-colors duration-card mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left - Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="bg-white rounded-lg overflow-hidden shadow-card mb-4">
              <div className="aspect-square">
                <img
                  src={images[selectedImage]}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-1 aspect-square rounded-lg overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-sage' : ''
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right - Product Details */}
          <div className="bg-white rounded-lg shadow-card p-6 md:p-8 h-fit">
            {/* Category Tag */}
            <span className="tag-category mb-4 inline-block">{category}</span>

            {/* Product Name */}
            <h1 className="font-heading text-3xl md:text-4xl font-medium text-text-primary mb-4">
              {name}
            </h1>

            {/* Price */}
            <div className="mb-6">
              {isFree ? (
                <span className="tag-free text-lg px-4 py-2">Free</span>
              ) : (
                <p className="text-4xl font-semibold text-green-dark">
                  ₹{price.toLocaleString()}
                </p>
              )}
            </div>

            {/* Condition */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-text-secondary mb-2">Condition</h3>
              <span className="inline-block px-3 py-1 bg-off-white text-text-primary text-sm font-medium rounded-lg">
                {condition}
              </span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-text-secondary mb-2">Description</h3>
              <p className="text-text-primary leading-relaxed">{description}</p>
            </div>

            {/* Location */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-text-secondary mb-2">Pickup Location</h3>
              <p className="flex items-center gap-2 text-text-primary">
                <svg className="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {location}
              </p>
            </div>

            {/* Seller Info */}
            <div className="mb-8 p-4 bg-off-white rounded-lg">
              <h3 className="text-sm font-medium text-text-secondary mb-2">Seller</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-text-primary">{seller.name}</p>
                  {seller.verified && (
                    <span className="badge-verified mt-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full">
                Contact Seller
              </Button>
              <Button variant="secondary" className="w-full">
                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Add to Wishlist
              </Button>
              <button
                onClick={() => setShowReportModal(true)}
                className="w-full text-center text-sm text-text-muted hover:text-error transition-colors duration-card"
              >
                Report this listing
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="font-heading text-xl font-medium text-text-primary mb-4">
              Report Listing
            </h3>
            <p className="text-text-secondary mb-4">
              Please select a reason for reporting this listing:
            </p>
            <div className="space-y-2 mb-6">
              <label className="flex items-center gap-2">
                <input type="radio" name="report" className="text-sage" />
                <span className="text-text-primary">Misleading information</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="report" className="text-sage" />
                <span className="text-text-primary">Inappropriate content</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="report" className="text-sage" />
                <span className="text-text-primary">Scam or fraud</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="report" className="text-sage" />
                <span className="text-text-primary">Already sold</span>
              </label>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setShowReportModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={() => setShowReportModal(false)} className="flex-1">
                Submit Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;