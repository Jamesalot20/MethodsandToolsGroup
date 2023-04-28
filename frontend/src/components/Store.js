import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import styles from '../Store.css';
import { CartContext } from './CartContext';

const Store = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [successMessage, setSuccessMessage] = useState({});
  const { addToCart } = useContext(CartContext);

  const getProducts = async () => {
    try {
      const response = await api.get('/products', {
        params: { search, category },
      });
      console.log('Response data:', response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      console.log('Axios error object:', error.response);
    }
  };

  useEffect(() => {
    getProducts();
  }, [category, search]);

  const handleAddToCart = (productId) => {
    addToCart(productId);
    setSuccessMessage({ [productId]: 'Item added to cart!' });
    setTimeout(() => {
      setSuccessMessage((prevState) => ({ ...prevState, [productId]: '' }));
    }, 3000);
  };

  return (
    <div>
      <h1>Store</h1>
      <input
        type="text"
        placeholder="Search for products"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={getProducts}>Search</button>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        <option value="GPU">GPU</option>
        <option value="CPU">CPU</option>
        <option value="RAM">RAM</option>
      </select>

      <div>
        {products.map((product) => (
          <div key={product._id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <button onClick={() => handleAddToCart(product._id)}>Add to Cart</button>
            {successMessage[product._id] && (
              <span className="success-message">{successMessage[product._id]}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;
