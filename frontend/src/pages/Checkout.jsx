import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/checkout.css";

function Checkout({ allProducts, total }) {
    const navigate = useNavigate();

    const [postalCode, setPostalCode] = useState("");
    const [shippingMethod, setShippingMethod] = useState("");
    const [shippingCost, setShippingCost] = useState(0);

    const totalItems = allProducts.reduce(
        (acc, product) => acc + (product.Cantidad || 0),
        0,
    );

    const handleShippingChange = (method) => {
        setShippingMethod(method);

        if (method === "standard") {
            setShippingCost(3500);
        }

        if (method === "express") {
            setShippingCost(6000);
        }

        if (method === "pickup") {
            setShippingCost(0);
        }
    };

    const finalTotal = Number(total) + shippingCost;

    if (allProducts.length === 0) {
        return (
            <main className='checkout'>
                <div className='checkout-empty'>
                    <h2>Tu carrito está vacío</h2>

                    <p>Agregá productos antes de continuar con la compra.</p>

                    <button onClick={() => navigate("/")}>
                        Volver al catálogo
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className='checkout'>
            <div className='checkout-container'>
                <div className='checkout-header'>
                    <button
                        className='checkout-back'
                        onClick={() => navigate("/")}
                    >
                        ← Volver al catálogo
                    </button>

                    <h1>Finalizar compra</h1>

                    <p>Revisá tu pedido y completá los datos de envío.</p>
                </div>

                <div className='checkout-content'>
                    {/* DATOS DEL CLIENTE */}
                    <section className='checkout-section'>
                        <h2>Datos de contacto</h2>

                        <div className='checkout-form'>
                            <div className='form-group'>
                                <label>Nombre completo</label>

                                <input
                                    type='text'
                                    placeholder='Nombre y apellido'
                                />
                            </div>

                            <div className='form-group'>
                                <label>Email</label>

                                <input
                                    type='email'
                                    placeholder='correo@ejemplo.com'
                                />
                            </div>

                            <div className='form-group'>
                                <label>Teléfono</label>

                                <input type='tel' placeholder='11 1234 5678' />
                            </div>
                        </div>
                    </section>

                    {/* ENVÍO */}
                    <section className='checkout-section'>
                        <h2>Datos de envío</h2>

                        <div className='checkout-form'>
                            <div className='form-group'>
                                <label>Dirección</label>

                                <input
                                    type='text'
                                    placeholder='Calle y número'
                                />
                            </div>

                            <div className='form-group'>
                                <label>Ciudad</label>

                                <input type='text' placeholder='Ciudad' />
                            </div>

                            <div className='form-group'>
                                <label>Código postal</label>

                                <input
                                    type='text'
                                    placeholder='Ej: 5000'
                                    value={postalCode}
                                    onChange={(e) =>
                                        setPostalCode(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </section>

                    {/* MÉTODO DE ENVÍO */}
                    <section className='checkout-section'>
                        <h2>Método de envío</h2>

                        <div className='shipping-options'>
                            <button
                                type='button'
                                className={
                                    shippingMethod === "standard"
                                        ? "shipping-option selected"
                                        : "shipping-option"
                                }
                                onClick={() => handleShippingChange("standard")}
                            >
                                <div>
                                    <strong>Envío estándar</strong>

                                    <span>Entrega estimada: 3-5 días</span>
                                </div>

                                <strong>$3.500</strong>
                            </button>

                            <button
                                type='button'
                                className={
                                    shippingMethod === "express"
                                        ? "shipping-option selected"
                                        : "shipping-option"
                                }
                                onClick={() => handleShippingChange("express")}
                            >
                                <div>
                                    <strong>Envío express</strong>

                                    <span>Entrega estimada: 1-2 días</span>
                                </div>

                                <strong>$6.000</strong>
                            </button>

                            <button
                                type='button'
                                className={
                                    shippingMethod === "pickup"
                                        ? "shipping-option selected"
                                        : "shipping-option"
                                }
                                onClick={() => handleShippingChange("pickup")}
                            >
                                <div>
                                    <strong>Retiro en sucursal</strong>

                                    <span>Retirá tu pedido sin costo</span>
                                </div>

                                <strong>Gratis</strong>
                            </button>
                        </div>
                    </section>

                    {/* PEDIDO */}
                    <section className='checkout-section'>
                        <h2>Resumen del pedido</h2>

                        <div className='checkout-products'>
                            {allProducts.map((product) => (
                                <div
                                    className='checkout-product'
                                    key={`${product.id}-${product.variante_id}`}
                                >
                                    <div className='checkout-product-image'>
                                        <img
                                            src={product.imagen}
                                            alt={product.nombre}
                                        />
                                    </div>

                                    <div className='checkout-product-info'>
                                        <h3>{product.nombre}</h3>

                                        <span>
                                            Talle:{" "}
                                            <strong>{product.talle}</strong>
                                        </span>

                                        <span>
                                            Cantidad:{" "}
                                            <strong>{product.Cantidad}</strong>
                                        </span>
                                    </div>

                                    <strong className='checkout-product-price'>
                                        $
                                        {(
                                            Number(product.precio) *
                                            product.Cantidad
                                        ).toLocaleString("es-AR")}
                                    </strong>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* RESUMEN FINAL */}
                    <section className='checkout-summary'>
                        <div>
                            <span>Productos ({totalItems})</span>

                            <strong>
                                ${Number(total).toLocaleString("es-AR")}
                            </strong>
                        </div>

                        <div>
                            <span>Envío</span>

                            <strong>
                                {shippingCost === 0
                                    ? "A calcular"
                                    : `$${shippingCost.toLocaleString(
                                          "es-AR",
                                      )}`}
                            </strong>
                        </div>

                        <div className='checkout-final-total'>
                            <span>Total</span>

                            <strong>
                                ${finalTotal.toLocaleString("es-AR")}
                            </strong>
                        </div>

                        <button
                            className='checkout-continue'
                            disabled={!shippingMethod}
                            onClick={() => {
                                navigate("/pago", {state:{total:finalTotal, productos:allProducts,},});                                
                            }}
                        >
                            Continuar al pago
                        </button>
                    </section>
                </div>
            </div>
        </main>
    );
}

export default Checkout;
