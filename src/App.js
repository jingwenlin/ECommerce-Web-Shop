// import React, { useState, useEffect} from 'react'
// import { commerce } from './lib/commerce';

// import { Navbar, Products } from './components';


// const App = () => {
//   const [products, setProducts] = useState([]);
//   const [cart, setCart] = useState({});

//   const fetchProducts = async () => {
//     const { data } = await commerce.products.list();

//     setProducts(data);
//   };

//   const fetchCart = async () => {
//     setCart(await commerce.cart.retrieve());
//   };

//   const handleAddToCart = async (productId, quantity) => {
//     const item = await commerce.cart.add(productId, quantity);

//     setCart(item.cart);
//   };

//   useEffect(() => {
//     fetchProducts();
//     fetchCart();
//   }, []);


//   console.log(cart);


//   return (
//     <div>
//         <Navbar totalItems={cart.total_items}/>
//         <Products products={products} onAddToCart={handleAddToCart}/>
//     </div>
//   )
// }

// export default App


import React, { useState, useEffect } from 'react';
import { commerce } from './lib/commerce';
import { Navbar, Products, Cart} from './components';

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ total_items: 0 }); // Initialize with a default structure

  const fetchProducts = async () => {
    const { data } = await commerce.products.list();
    setProducts(data);
  };

  const fetchCart = async () => {
    const cart = await commerce.cart.retrieve();
    setCart(cart);
  };

  const handleAddToCart = async (productId, quantity) => {
    try {
      console.log('Adding to cart:', productId, quantity);
      const response = await commerce.cart.add(productId, quantity);
      console.log('Response from add to cart:', response); // Log response
      setCart(response); // Update the cart state
      console.log('Cart after add:', response); // Log updated cart
    } catch (error) {
      console.error('Error adding to cart:', error); // Log error
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const totalItems = cart.total_items !== undefined ? cart.total_items : 0;

  console.log('Cart:', cart); // Debug log

  return (
    <div>
      <Navbar totalItems={totalItems} />
      {/* <Products products={products} onAddToCart={handleAddToCart} /> */}
      <Cart cart={cart}/>
    </div>
  );
};

export default App;


