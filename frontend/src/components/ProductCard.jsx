import "../styles/productCard.css";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
    const navigate = useNavigate();

    const sizeOrder = [
        "XXXS",
        "XXS",
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL",
        "XXXL",
        "XXXXL",
    ];

    const goToDetail = () => {
        navigate(`/producto/${product.id}`);
    };

    /*
     * Filtramos solamente las variantes
     * que tienen stock y las ordenamos
     * correctamente por talle.
     */
    const availableSizes = (product.variantes || [])
        .filter((variant) => variant.stock > 0)
        .sort((a, b) => {
            const talleA = String(a.talle).trim().toUpperCase();
            const talleB = String(b.talle).trim().toUpperCase();

            const indexA = sizeOrder.indexOf(talleA);
            const indexB = sizeOrder.indexOf(talleB);

            return indexA - indexB;
        })
        .map((variant) => variant.talle);

    const hasStock = availableSizes.length > 0;

    return (
        <div className='card' onClick={goToDetail}>
            {/* IMAGEN */}
            <img
                src={product.imagen}
                className='card-img-top'
                alt={product.nombre}
            />

            {/* INFORMACIÓN */}
            <div className='card-body'>
                <h2 className='card-title'>
                    {product.nombre}
                </h2>

                <p className='card-text'>
                    {product.descripcion}
                </p>
            </div>

            {/* PRECIO + DISPONIBILIDAD */}
            <div className='cardMid'>
                <h6>
                    ${Number(product.precio).toLocaleString("es-AR")}
                </h6>

                <h6>
                    {hasStock ? "Disponible" : "Sin stock"}
                </h6>
            </div>

            {/* TALLES DISPONIBLES */}
            {hasStock && (
                <div className='cardSizes'>
                    <span>Talles disponibles:</span>

                    <div className='cardSizeList'>
                        {availableSizes.map((size, index) => (
                            <span
                                className='cardSize'
                                key={`${size}-${index}`}
                            >
                                {size}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* BOTÓN */}
            <div className='cardDown'>
                <button
                    className={
                        hasStock
                            ? "btnCar"
                            : "btnCar btnCarDisabled"
                    }
                    onClick={(e) => {
                        e.stopPropagation();
                        goToDetail();
                    }}
                    disabled={!hasStock}
                >
                    {hasStock ? "Ver producto" : "Sin stock"}

                    {hasStock && (
                        <AiOutlineArrowRight className='carIcon' />
                    )}
                </button>
            </div>
        </div>
    );
}

export default ProductCard;