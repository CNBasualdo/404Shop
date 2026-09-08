import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/pagos.css";

function Pago () {

    const navigate = useNavigate();
    const location = useLocation();
    
    const total = location.state?.total || 0;
    const productos = location.state?.productos || [];

    const [metodoPago, setMetodoPago] = useState("tarjeta");

    const [datosTarjeta, setDatosTarjeta] = useState({
        numero: "",
        vencimiento: "",
        cvv: "",
        titular: "",
    });

    const [errores, setErrores] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        setDatosTarjeta((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrores((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const validarTarjeta = () => {
        const nuevosErrores = {};

        const numeroLimpio = datosTarjeta.numero.replace(/\s/g, "");

        // Número de tarjeta
        if (!numeroLimpio) {
            nuevosErrores.numero = "Ingresá el número de tarjeta.";
        } else if (!/^\d{16}$/.test(numeroLimpio)) {
            nuevosErrores.numero =
                "El número de tarjeta debe tener 16 dígitos.";
        }

        // Vencimiento
        if (!datosTarjeta.vencimiento.trim()) {
            nuevosErrores.vencimiento = "Ingresá la fecha de vencimiento.";
        } else if (
            !/^(0[1-9]|1[0-2])\/\d{2}$/.test(datosTarjeta.vencimiento.trim())
        ) {
            nuevosErrores.vencimiento = "Usá el formato MM/AA.";
        }

        // CVV
        if (!datosTarjeta.cvv.trim()) {
            nuevosErrores.cvv = "Ingresá el CVV.";
        } else if (!/^\d{3,4}$/.test(datosTarjeta.cvv.trim())) {
            nuevosErrores.cvv = "El CVV debe tener 3 o 4 dígitos.";
        }

        // Titular
        if (!datosTarjeta.titular.trim()) {
            nuevosErrores.titular = "Ingresá el nombre del titular.";
        } else if (datosTarjeta.titular.trim().length < 3) {
            nuevosErrores.titular = "Ingresá un nombre válido.";
        }

        setErrores(nuevosErrores);

        return Object.keys(nuevosErrores).length === 0;
    };

    const handlePago = async () => {
        if (metodoPago === "tarjeta") {
        const tarjetaValida = validarTarjeta();

        if (!tarjetaValida) {
            return;
        }
    }

    if (productos.length === 0) {
        alert("No hay productos para procesar.");
        return;
    }

    try {
        const productosCompra = productos.map((producto) => ({
            variante_id: producto.variante_id,
            cantidad: producto.Cantidad,
        }));

        await axios.post(
            "http://127.0.0.1:8000/api/v1/confirmar-compra/",
            {
                productos: productosCompra,
            }
        );

        navigate("/compra-exitosa", {
            state:{total:total,},
        });

    } catch (error) {
        console.error("Error al confirmar la compra:", error);

        if (error.response?.data?.error) {
            alert(error.response.data.error);
        } else {
            alert("No se pudo procesar la compra.");
        }
    }
    };

    const cambiarMetodoPago = (metodo) => {
        setMetodoPago(metodo);
        setErrores({});
    };

    return (
        <main className='pagoPage'>
            <button
                type='button'
                className='pagoBackButton'
                onClick={() => navigate(-1)}
            >
                ← Volver
            </button>

            <div className='pagoContainer'>
                <div className='pagoHeader'>
                    <h1>Finalizar pago</h1>

                    <p>
                        Seleccioná un método de pago para completar tu compra.
                    </p>
                </div>

                <section className='pagoCard'>
                    <h2>Método de pago</h2>

                    <div className='metodosPago'>
                        {/* TARJETA */}

                        <button
                            type='button'
                            className={
                                metodoPago === "tarjeta"
                                    ? "metodoPago selected"
                                    : "metodoPago"
                            }
                            onClick={() => cambiarMetodoPago("tarjeta")}
                        >
                            <span>💳</span>

                            <div>
                                <strong>Tarjeta</strong>
                                <small>Crédito o débito</small>
                            </div>
                        </button>

                        {/* QR */}

                        <button
                            type='button'
                            className={
                                metodoPago === "qr"
                                    ? "metodoPago selected"
                                    : "metodoPago"
                            }
                            onClick={() => cambiarMetodoPago("qr")}
                        >
                            <span>📱</span>

                            <div>
                                <strong>Pago con QR</strong>
                                <small>Escaneá el código QR</small>
                            </div>
                        </button>

                        {/* TRANSFERENCIA */}

                        <button
                            type='button'
                            className={
                                metodoPago === "transferencia"
                                    ? "metodoPago selected"
                                    : "metodoPago"
                            }
                            onClick={() => cambiarMetodoPago("transferencia")}
                        >
                            <span>🏦</span>

                            <div>
                                <strong>Transferencia</strong>
                                <small>Transferencia bancaria</small>
                            </div>
                        </button>
                    </div>

                    {/* ==================== */}
                    {/* DATOS DE TARJETA */}
                    {/* ==================== */}

                    {metodoPago === "tarjeta" && (
                        <div className='pagoFormulario'>
                            <h3>Datos de la tarjeta</h3>

                            <label>Número de tarjeta</label>

                            <input
                                type='text'
                                name='numero'
                                value={datosTarjeta.numero}
                                onChange={handleChange}
                                placeholder='0000 0000 0000 0000'
                                maxLength={19}
                            />

                            {errores.numero && (
                                <span className='mensajeError'>
                                    {errores.numero}
                                </span>
                            )}

                            <div className='pagoFila'>
                                <div>
                                    <label>Vencimiento</label>

                                    <input
                                        type='text'
                                        name='vencimiento'
                                        value={datosTarjeta.vencimiento}
                                        onChange={handleChange}
                                        placeholder='MM/AA'
                                        maxLength={5}
                                    />

                                    {errores.vencimiento && (
                                        <span className='mensajeError'>
                                            {errores.vencimiento}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label>CVV</label>

                                    <input
                                        type='text'
                                        name='cvv'
                                        value={datosTarjeta.cvv}
                                        onChange={handleChange}
                                        placeholder='123'
                                        maxLength={4}
                                    />

                                    {errores.cvv && (
                                        <span className='mensajeError'>
                                            {errores.cvv}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <label>Nombre del titular</label>

                            <input
                                type='text'
                                name='titular'
                                value={datosTarjeta.titular}
                                onChange={handleChange}
                                placeholder='Nombre completo'
                            />

                            {errores.titular && (
                                <span className='mensajeError'>
                                    {errores.titular}
                                </span>
                            )}
                        </div>
                    )}

                    {/* ==================== */}
                    {/* PAGO QR */}
                    {/* ==================== */}

                    {metodoPago === "qr" && (
                        <div className='pagoQR'>
                            <h3>Pago con QR</h3>

                            <div className='qrPlaceholder'>
                                <div className='qrFake'>QR</div>
                            </div>

                            <p>
                                Escaneá el código QR con tu aplicación de pagos
                                para completar la compra.
                            </p>
                        </div>
                    )}

                    {/* ==================== */}
                    {/* TRANSFERENCIA */}
                    {/* ==================== */}

                    {metodoPago === "transferencia" && (
                        <div className='pagoTransferencia'>
                            <h3>Transferencia bancaria</h3>

                            <div className='datosTransferencia'>
                                <p>
                                    <strong>Banco:</strong> 404 Bank
                                </p>

                                <p>
                                    <strong>Alias:</strong> 404SHOP.PAGO
                                </p>

                                <p>
                                    <strong>CBU:</strong> 0000000000000000000000
                                </p>
                            </div>

                            <p className='transferenciaInfo'>
                                Una vez realizada la transferencia, presioná el
                                botón para confirmar.
                            </p>
                        </div>
                    )}

                    {/* ==================== */}
                    {/* RESUMEN */}
                    {/* ==================== */}

                    <div className='pagoResumen'>
                        <span>Total a pagar</span>

                        <strong>
                            ${Number(total).toLocaleString("es-AR")}
                        </strong>
                    </div>

                    {/* ==================== */}
                    {/* CONFIRMAR */}
                    {/* ==================== */}

                    <button
                        type='button'
                        className='confirmarPago'
                        onClick={handlePago}
                    >
                        Confirmar pago
                    </button>
                </section>
            </div>
        </main>
    );
}

export default Pago;
