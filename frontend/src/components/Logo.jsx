import { FiShoppingCart } from "react-icons/fi";
import "../styles/logo.css";

import React from "react";

function Logo() {
    return (
        <div className='logo' aria-label="404shop">
            <div className="logo-mark">
                <div className="logo-speed">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <FiShoppingCart className="logo-cart"/>
            </div>
            <div className="logo-text">
                <span className="logo-number">404</span>
                <span className="logo-shop">shop</span>
            </div>
        </div>
    );
}

export default Logo;
