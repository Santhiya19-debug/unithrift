import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import WishlistButton from '../components/common/WishlistButton';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Product not found');
        }

        setProduct(data.product);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <p className="text-text-secondary">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-2xl text-text-primary mb-4">
            Product not found
          </h2>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const {
    title,
    price,
    isFree,
    images = [],
    location,
    category,
    condition,
    description,
    seller
  } = product;

  return (
    <div className="min-h-screen bg-off-white">
      <div className="container-custom py-8 md:py-12">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-secondary hover:text-green-dark mb-6"
        >
          ← Back
        </button>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* Images */}
          <div>
            <div className="bg-white rounded-lg overflow-hidden shadow-card mb-4 aspect-square">
              <img
                src={images[selectedImage] || '/placeholder.png'}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-1 aspect-square rounded-lg overflow-hidden ${
                      selectedImage === idx ? 'ring-2 ring-sage' : ''
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="bg-white rounded-lg shadow-card p-6">

            <span className="tag-category mb-4 inline-block">{category}</span>

            <h1 className="font-heading text-3xl mb-4">{title}</h1>

            {isFree ? (
              <span className="tag-free px-4 py-2">Free</span>
            ) : (
              <p className="text-4xl font-semibold text-green-dark">
                ₹{price}
              </p>
            )}

            <div className="mt-6">
              <h3 className="text-sm text-text-secondary mb-1">Condition</h3>
              <p>{condition}</p>
            </div>

            <div className="mt-4">
              <h3 className="text-sm text-text-secondary mb-1">Description</h3>
              <p className="leading-relaxed">{description}</p>
            </div>

            <div className="mt-4">
              <h3 className="text-sm text-text-secondary mb-1">Pickup Location</h3>
              <p>{location}</p>
            </div>

            {/* Seller */}
            <div className="mt-6 p-4 bg-off-white rounded-lg">
              <p className="font-medium">
                {seller?.name || 'Unknown Seller'}
              </p>
              {seller?.isVerified && (
                <span className="badge-verified mt-1 inline-block">
                  Verified
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-3">
              <Button className="w-full">Contact Seller</Button>
              <Button variant="secondary" className="w-full">
                Add to Wishlist
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

