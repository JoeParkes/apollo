// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import ProductList from './components/productList'; // Changed ProductList to productList

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<ProductList />); // Render the ProductList component
}
