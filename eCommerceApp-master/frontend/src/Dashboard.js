import React, { useState, useEffect } from 'react';
import { fetchProducts, addToCart, addToWishlist } from './api';
import { useNavigate } from 'react-router-dom';

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

    const handleOrder = async (productId) => {
        try {
            await addToCart(productId);
            setMessage('Product added to cart!');
        } catch (err) {
            setMessage('Failed to add to cart');
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
        // TODO: call backend API for review
    };

    return (
        <div className="dashboard-container">
            <div className="header">
                <h2>Available Products</h2>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>

            {message && <p>{message}</p>}

            <div className="products-grid">
                {products.map(product => (
                    <div key={product._id} className="product-card">
                        <img src={`/images/${product.image}`} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p><strong>Price: </strong>${product.price}</p>
                        <button onClick={() => handleOrder(product._id)}>Order Now</button>
                        <button className="wishlist-button" onClick={() => handleWishlist(product._id)}>💖 Save to Wishlist</button>

                        <div className="review-form">
                            <h4>Leave a Review</h4>
                            <select value={reviews[product._id]?.rating || ''} onChange={(e) => handleReviewChange(product._id, 'rating', e.target.value)}>
                                <option value="">Select Rating</option>
                                {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
                            </select>
                            <textarea placeholder="Your comment..." value={reviews[product._id]?.comment || ''} onChange={(e) => handleReviewChange(product._id, 'comment', e.target.value)} />
                            <button onClick={() => handleSubmitReview(product._id)}>Submit Review</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;