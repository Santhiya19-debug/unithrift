const API_BASE = import.meta.env.VITE_API_BASE_URL;

/**
 * Creates a new product listing using FormData (for image files)
 */
export async function createProduct(token, formData) {
  if (!token || token === 'undefined') {
    throw new Error("You are not logged in. Please log in again.");
  }

  // NOTE: When sending FormData, do NOT set 'Content-Type' header.
  // The browser will automatically set it with the correct boundary.
  const res = await fetch(`${API_BASE}/api/products`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token.trim()}` 
    },
    body: formData // Send the FormData object directly
  });

  if (!res.ok) {
    const errorText = await res.text();
    let errorMessage = 'Failed to create product';
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorMessage;
    } catch (e) {
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return await res.json();
}

/**
 * Fetches products belonging to the logged-in user
 */
export async function getMyProducts(token) {
  const res = await fetch(`${API_BASE}/api/products/my`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || 'Failed to fetch products');
  }

  return result.products || (Array.isArray(result) ? result : []);
}

/**
 * Fetches a single product by its ID
 */
export async function getProductById(id) {
  const res = await fetch(`${API_BASE}/api/products/${id}`);
  
  const result = await res.json();
  
  if (!res.ok) {
    throw new Error(result.message || 'Failed to fetch product details');
  }
  
  return result.product || result;
}

/**
 * Updates an existing product listing using FormData
 */
export async function updateProduct(id, token, formData) {
  if (!token || token === 'undefined') {
    throw new Error("Authentication required to update listing.");
  }

  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token.trim()}`
    },
    body: formData // Use FormData for updates that may include new images
  });

  if (!res.ok) {
    const result = await res.json();
    throw new Error(result.message || 'Failed to update product');
  }

  return await res.json();
}

/**
 * Deletes/Removes a product listing (Soft Delete)
 */
export async function deleteProduct(id, token) {
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || 'Failed to delete product');
  }

  return result;
}