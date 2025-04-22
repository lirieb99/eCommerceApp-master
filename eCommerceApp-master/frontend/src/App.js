import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './AuthPage';
import Dashboard from './Dashboard';
import Products from './Products';
import PrivateRoute from './PrivateRoute';
import Cart from './CartPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
                <Route path = "/cart" element={<Cart/>}/>
            </Routes>
        </Router>
    );
}

export default App;