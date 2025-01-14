// src/components/ProductList.tsx
import React, { useEffect, useState } from 'react';

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Make sure window.shopifyData is available (injected via Liquid)
    if (window.shopifyData && window.shopifyData.products) {
      setProducts(window.shopifyData.products);
    }
  }, []);

  return (
    <div>
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product.id}>
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            {product.image && <img src={product.image} alt={product.title} />}
          </div>
        ))
      ) : (
        <p>Loading products...</p>
      )}
    </div>
  );
};

export default ProductList;
