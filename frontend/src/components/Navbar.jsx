import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    AiOutlineShoppingCart,
    AiOutlineMinus,
    AiOutlinePlus,
} from "react-icons/ai";
import "../styles/navBar.css";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

function Navbar({ allProducts, total, setAllProducts }) {
    const navigate = useNavigate();
    const [active, setActive] = useState(true);

    const toggleCart = () => {
        setActive(!active);
    };

    const vaciarCarrito = () => {
        setAllProducts([]);
    };

    const totalItems = allProducts.reduce(
        (acc, product) => acc + (product.Cantidad || 0),
        0,
    );

    const increaseQuantity = (productId, varianteId) => {
        setAllProducts((currentProducts) =>
            currentProducts.map((product) => {
                if (
                    product.id === productId &&
                    product.variante_id === varianteId
                ) {
                    if (product.Cantidad >= product.stock) {
                        return product;
                    }

                    return {
                        ...product,
                        Cantidad: product.Cantidad + 1,
                    };
                }

                return product;
            }),
        );
    };

    const decreaseQuantity = (productId, varianteId) => {
        setAllProducts((currentProducts) =>
            currentProducts
                .map((product) => {
                    if (
                        product.id === productId &&
                        product.variante_id === varianteId
                    ) {
                        return {
                            ...product,
                            Cantidad: product.Cantidad - 1,
                        };
                    }

                    return product;
                })
                .filter((product) => product.Cantidad > 0),
        );
    };

    return (
        <nav className='navbar'>
            <div className='navbar-container'>
                <a href='#' className='navbar-logo'>
                    <Logo />
                </a>

                <div className='navbar-actions'>
                    <ThemeToggle />

                    <button
                        className='cart-button'
                        type='button'
                        onClick={toggleCart}
                        aria-label='abrir carrito'
                    >
                        <AiOutlineShoppingCart />

                        {totalItems > 0 && (
                            <span className='cart-badge'>{totalItems}</span>
                        )}
                    </button>
                </div>
            </div>

            <div className={`cart-panel ${active ? "" : "cart-panel-open"}`}>
                <div className='cart-header'>
                    <div>
                        <h2>Mi carrito</h2>

                        <span>
                            {totalItems}{" "}
                            {totalItems === 1 ? "producto" : "productos"}
                        </span>
                    </div>

                    <button
                        className='cart-close'
                        onClick={toggleCart}
                        aria-label='Cerrar carrito'
                    >
                        X
                    </button>
                </div>

                <div className='cart-body'>
                    {allProducts.length ? (
                        <>
                            <div className='cart-products'>
                                {allProducts.map((product) => (
                                    <div
                                        className='cart-product'
                                        key={`${product.id}-${product.variante_id}`}
                                    >
                                        <div className='cart-product-image'>
                                            <img
                                                src={product.imagen}
                                                alt={product.nombre}
                                            />
                                        </div>

                                        <div className='cart-product-info'>
                                            <h3>{product.nombre}</h3>

                                            <span className='cart-product-size'>
                                                Talle: {product.talle}
                                            </span>

                                            <p>
                                                $
                                                {Number(
                                                    product.precio,
                                                ).toLocaleString("es-AR")}
                                            </p>

                                            <div className='cart-quantity'>
                                                <button
                                                    type='button'
                                                    onClick={() =>
                                                        decreaseQuantity(
                                                            product.id,
                                                            product.variante_id,
                                                        )
                                                    }
                                                    aria-label={`Disminuir cantidad de ${product.nombre}, talle ${product.talle}`}
                                                >
                                                    <AiOutlineMinus />
                                                </button>

                                                <span>{product.Cantidad}</span>

                                                <button
                                                    type='button'
                                                    onClick={() =>
                                                        increaseQuantity(
                                                            product.id,
                                                            product.variante_id,
                                                        )
                                                    }
                                                    disabled={
                                                        product.Cantidad >=
                                                        product.stock
                                                    }
                                                    aria-label={`Aumentar cantidad de ${product.nombre}, talle ${product.talle}`}
                                                >
                                                    <AiOutlinePlus />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className='cart-summary'>
                                <div className='cart-total'>
                                    <span>Total</span>

                                    <strong>
                                        ${Number(total).toLocaleString("es-AR")}
                                    </strong>
                                </div>
                                <button
                                    className='checkout-button'
                                    onClick={() => {
                                        setActive(true);
                                        navigate("/checkout");
                                    }}
                                >
                                    Continuar compra
                                </button>

                                <button
                                    className='clear-cart-button'
                                    onClick={vaciarCarrito}
                                >
                                    Vaciar Carrito
                                </button>
                                
                            </div>
                        </>
                    ) : (
                        <div className='empty-cart'>
                            <AiOutlineShoppingCart />

                            <h3>Tu carrito esta vacio</h3>

                            <p>Agrega algunos productos para comenzar</p>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
