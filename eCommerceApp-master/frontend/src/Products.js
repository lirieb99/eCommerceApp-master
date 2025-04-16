import React, { useState, useEffect } from 'react';
import { fetchProducts } from './api';

function Products() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts()
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h2>Product Listing</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {products.map((product) => (
                    <div
                        key={product._id}
                       
                    >
                       <img src={`/images/${product.image}`} alt={product.name} className="product-img" />

                        <h4>{product.name}</h4>
                        <p>${product.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Products;