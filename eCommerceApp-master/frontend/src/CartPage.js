import React, { useEffect, useState } from 'react';
import { getCartItems, removeFromCart, placeCartOrder } from './api';
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = async () => {
      try {
        const res = await getCartItems();
        setCartItems(res.data.items);
      } catch (err) {
        console.error(err);
      }
    };
    loadCart();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      setCartItems(prev => prev.filter(item => item.productId._id !== productId));
      setMessage("Product removed from cart.");
    } catch (err) {
      console.error(err);
      setMessage("Failed to remove product from cart.");
    }
  };

  const handleCheckout = async () => {
    try {
      const products = cartItems.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price
      }));

      await placeCartOrder(products);
      setMessage("Order placed successfully!");
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setMessage("Failed to place order");
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + (item.quantity * item.productId.price), 0);

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {message && <p>{message}</p>}

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className="cart-list">
          {cartItems.map(item => (
            <li key={item.productId._id} className="cart-item">
              <div className="item-details">
                <h4>{item.productId.name}</h4>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.productId.price}</p>
              </div>
              <button className="remove-button" onClick={() => handleRemove(item.productId._id)}>
  ❌ Remove from Cart
</button>

            </li>
          ))}
        </ul>
      )}

      {cartItems.length > 0 && (
        <>
          <h3 className="cart-total">Total: ${totalPrice}</h3>
          <button onClick={handleCheckout} className="checkout-button">Checkout</button>
        </>
      )}
    </div>
  );
}

export default CartPage;
