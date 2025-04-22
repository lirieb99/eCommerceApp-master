import React, { useState, useEffect } from 'react';
import { fetchProducts, placeSingleOrder, addToWishlist } from './api';
import { useNavigate } from 'react-router-dom';
import { addToCart } from './api'; // ✅ FIX ReferenceError
import { deleteProduct } from './api'; // për fshirjen e produktit


function Dashboard() {
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState('');
    const [reviews, setReviews] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await fetchProducts();
                setProducts(response.data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        };
        loadProducts();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleOrder = async (productId, price) => {
        try {
            await placeSingleOrder(productId, price);
            setMessage('Order placed successfully!');
        } catch (err) {
            setMessage('Failed to place order');
            console.error(err);
        }
    };
    

    const handleWishlist = async (productId) => {
        try {
            await addToWishlist(productId);
            setMessage('Product saved to wishlist!');
        } catch (err) {
            setMessage('Failed to save to wishlist');
            console.error(err);
        }
    };

    const handleReviewChange = (productId, field, value) => {
        setReviews(prev => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                [field]: value
            }
        }));
    };

    const handleSubmitReview = (productId) => {
        const { rating, comment } = reviews[productId] || {};
        console.log('Review submitted:', { productId, rating, comment });
    };

    const handleAddToCart = async (productId) => {
        try {
          await addToCart(productId);
          setMessage("Product added to cart!");
        } catch (error) {
          console.error(error);
          setMessage("Failed to add to cart.");
        }
      };
      const handleDeleteProduct = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
      
        try {
          await deleteProduct(productId);
          setProducts(prev => prev.filter(p => p._id !== productId));
          setMessage("Product deleted successfully!");
        } catch (err) {
          setMessage("Failed to delete product");
          console.error(err);
        }
      };
      
      
      return (
        <div className="page-container">
          {/* Header */}
          <header className="main-header">
            <div className="header-left">
              <h1>My Product Store</h1>
            </div>
            <div className="header-right">
              <button className="cart-button" onClick={() => navigate('/cart')}>
                🛒 Cart
              </button>
            </div>
          </header>
      
          {/* Content */}
          <main className="dashboard-container">
            {message && <p>{message}</p>}
      
            <div className="products-grid">
              {products.map(product => (
                <div key={product._id} className="product-card">
                  <img src={`/images/${product.image}`} alt={product.name} className="product-img" />
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p><strong>Price: </strong>${product.price}</p>
      
                  <button onClick={() => handleAddToCart(product._id)}>Add to Cart</button>
                  <button onClick={() => handleOrder(product._id, product.price)}>Order Now</button>
                  <button className="wishlist-button" onClick={() => handleWishlist(product._id)}>💖 Save to Wishlist</button>
      
                    

                  <div className="review-form">
                    <h4>Leave a Review</h4>
                    <select value={reviews[product._id]?.rating || ''} onChange={(e) => handleReviewChange(product._id, 'rating', e.target.value)}>
                      <option value="">Select Rating</option>
                      {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
                    </select>
                    <textarea
                      placeholder="Your comment..."
                      value={reviews[product._id]?.comment || ''}
                      onChange={(e) => handleReviewChange(product._id, 'comment', e.target.value)}
                    />
                    <button onClick={() => handleSubmitReview(product._id)}>Submit Review</button>
                    
                    
                  </div>
                </div>
              ))}
            </div>
          </main>
      
          {/* Footer */}
          <footer className="main-footer">
            <button className="logout-button" onClick={handleLogout}>Logout</button>
            <p>&copy; {new Date().getFullYear()} My Product Store. All rights reserved.</p>
          </footer>
        </div>
      );
    };

export default Dashboard;
