import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/compraExitosa.css";

function CompraExitosa({ setAllProducts }) {
    const navigate = useNavigate();
    const location = useLocation();

    const total = location.state?.total || 0;

    // Generamos un número de pedido para esta compra
    const numeroPedido =
        location.state?.numeroPedido ||
        Math.floor(100000 + Math.random() * 900000);

    useEffect(() => {
        // La compra ya fue realizada, vaciamos el carrito
        setAllProducts([]);
    }, [setAllProducts]);

    return (
        <main className='compraExitosaPage'>
            <section className='compraExitosaCard'>
                <div className='compraExitosaIcon'>✓</div>

                <h1>¡Compra realizada!</h1>

                <p className='compraMensaje'>
                    Gracias por tu compra. Tu pedido fue procesado
                    correctamente.
                </p>

                <div className='pedidoInfo'>
                    <span>Número de pedido</span>
                    <strong>#{numeroPedido}</strong>
                </div>

                <div className='totalCompra'>
                    <span>Total pagado</span>

                    <strong>${Number(total).toLocaleString("es-AR")}</strong>
                </div>

                <button
                    className='volverCatalogo'
                    onClick={() => navigate("/")}
                >
                    Volver al catálogo
                </button>
            </section>
        </main>
    );
}

export default CompraExitosa;
