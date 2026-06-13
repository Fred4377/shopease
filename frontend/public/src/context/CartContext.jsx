import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty) => {
    const existItem = cartItems.find((x) => x.product === product._id);

    if (existItem) {
      setCartItems(
        cartItems.map((x) =>
          x.product === existItem.product ? { ...x, qty } : x
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          countInStock: product.stock,
          qty,
        },
      ]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x.product !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const updateQuantity = (id, qty) => {
    setCartItems(
      cartItems.map((x) => (x.product === id ? { ...x, qty } : x))
    );
  };

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 50 || itemsPrice === 0 ? 0 : 5;
  const totalPrice = itemsPrice + shippingPrice;
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        itemsPrice,
        shippingPrice,
        totalPrice,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
