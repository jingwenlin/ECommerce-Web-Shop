import React, { useState, useEffect } from 'react';
import { commerce } from './lib/commerce';
import { Navbar, Products, Cart, Checkout } from './components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(null); // Initialize with null to avoid undefined issues
  const [loading, setLoading] = useState(true); // Loading state
  const [order, setOrder] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const fetchProducts = async () => {
    const { data } = await commerce.products.list();
    setProducts(data);
  };

  const fetchCart = async () => {
    const cart = await commerce.cart.retrieve();
    setCart(cart);
    setLoading(false); // Set loading to false after cart is fetched
  };

  const handleAddToCart = async (productId, quantity) => {
    const { cart } = await commerce.cart.add(productId, quantity);
    setCart(cart); // Update the cart state
  };

  const handleUpdateCartQty = async (productId, quantity) => {
    const { cart } = await commerce.cart.update(productId, { quantity });
    setCart(cart);
  };

  const handleRemoveFromCart = async (productId) => {
    const { cart } = await commerce.cart.remove(productId);
    setCart(cart);
  };

  const handleEmptyCart = async () => {
    const { cart } = await commerce.cart.empty();
    setCart(cart);
  };

  const refreshCart = async () => {
    const newCart = await commerce.cart.refresh();

    setCart(newCart);
  };

  const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
    try {
      const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);

      setOrder(incomingOrder);

      refreshCart();
    } catch (error) {
      setErrorMessage(error.data.error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const totalItems = cart ? cart.total_items : 0;

  if (loading) return <div>Loading...</div>; // Show loading state

  return (
    <Router>
      <div>
        <Navbar totalItems={totalItems} />
        <Routes>
          <Route
            exact
            path="/"
            element={<Products products={products} onAddToCart={handleAddToCart} />}
          />
          <Route
            exact
            path="/cart"
            element={
              <Cart
                cart={cart}
                handleUpdateCartQty={handleUpdateCartQty}
                handleRemoveFromCart={handleRemoveFromCart}
                handleEmptyCart={handleEmptyCart}
              />
            }
          />
          <Route
            exact
            path="/checkout"
            element={<Checkout 
              cart={cart}
              order={order}
              onCaptureCheckout={handleCaptureCheckout} 
              error={errorMessage}
              />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
