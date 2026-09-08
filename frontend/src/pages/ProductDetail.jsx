import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    AiOutlineShoppingCart,
    AiOutlineArrowLeft,
    AiOutlineMinus,
    AiOutlinePlus,
} from "react-icons/ai";

import { getProductByid } from "../api/prodcutoDetail.api";
import CarruselProduct from "../components/CarruselProduct";
import "../styles/productDetail.css";

function ProductDetail({ allProducts, setAllProducts, products }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // Referencia al contenedor real del carrusel
    const carruselRef = useRef(null);

    // Permite pausar el autoplay cuando el usuario interactúa
    const carruselPauseRef = useRef(false);

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

    const sortVariants = (variants) => {
        return [...variants].sort((a, b) => {
            const talleA = String(a.talle).trim().toUpperCase();
            const talleB = String(b.talle).trim().toUpperCase();

            const numeroA = Number(talleA);
            const numeroB = Number(talleB);

            const esNumeroA = !isNaN(numeroA);
            const esNumeroB = !isNaN(numeroB);

            if (esNumeroA && esNumeroB) {
                return numeroA - numeroB;
            }

            if (esNumeroA) {
                return -1;
            }

            if (esNumeroB) {
                return 1;
            }

            const indexA = sizeOrder.indexOf(talleA);
            const indexB = sizeOrder.indexOf(talleB);

            if (indexA !== -1 && indexB !== -1) {
                return indexA - indexB;
            }

            if (indexA !== -1) {
                return -1;
            }

            if (indexB !== -1) {
                return 1;
            }

            return talleA.localeCompare(talleB);
        });
    };

    /*
     * Cargar producto
     */
    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                setError(false);

                const res = await getProductByid(id);

                setProduct(res.data);

                const variants = res.data.variantes || [];
                const sortedVariants = sortVariants(variants);

                const firstAvailable = sortedVariants.find(
                    (variant) => variant.stock > 0,
                );

                setSelectedVariant(firstAvailable || sortedVariants[0] || null);

                setQuantity(1);
            } catch (error) {
                console.error("Error al cargar el producto:", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [id]);

    /*
     * Productos relacionados
     */
    const relatedProducts = products.filter(
        (item) =>
            item.categoria_nombre === product?.categoria_nombre &&
            item.id !== product?.id,
    );

    /*
     * AUTOPLAY DEL CARRUSEL
     */
    useEffect(() => {
        if (!product || relatedProducts.length <= 1) {
            return;
        }

        const carrusel = carruselRef.current;

        if (!carrusel) {
            return;
        }

        const interval = setInterval(() => {
            if (carruselPauseRef.current) {
                return;
            }

            const card = carrusel.querySelector(".carruselCard");

            if (!card) {
                return;
            }

            const cardWidth = card.offsetWidth;
            const gap = 18;

            const isAtEnd =
                carrusel.scrollLeft + carrusel.clientWidth >=
                carrusel.scrollWidth - 5;

            if (isAtEnd) {
                carrusel.scrollTo({
                    left: 0,
                    behavior: "smooth",
                });
            } else {
                carrusel.scrollBy({
                    left: cardWidth + gap,
                    behavior: "smooth",
                });
            }
        }, 3000);

        return () => {
            clearInterval(interval);
        };
    }, [product, relatedProducts.length]);

    /*
     * Cambiar talle
     */
    const handleVariantChange = (variant) => {
        setSelectedVariant(variant);
        setQuantity(1);
    };

    /*
     * Aumentar cantidad
     */
    const increaseQuantity = () => {
        if (!selectedVariant) return;

        if (quantity < selectedVariant.stock) {
            setQuantity((prev) => prev + 1);
        }
    };

    /*
     * Disminuir cantidad
     */
    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    /*
     * Agregar producto al carrito
     */
    const onAddProduct = () => {
        if (!product || !selectedVariant) {
            return;
        }

        if (selectedVariant.stock <= 0) {
            return;
        }

        const existingProduct = allProducts.find(
            (item) =>
                item.id === product.id &&
                item.variante_id === selectedVariant.id,
        );

        if (existingProduct) {
            const nuevaCantidad = existingProduct.Cantidad + quantity;

            if (nuevaCantidad > selectedVariant.stock) {
                return;
            }

            const updatedProducts = allProducts.map((item) =>
                item.id === product.id &&
                item.variante_id === selectedVariant.id
                    ? {
                          ...item,
                          Cantidad: nuevaCantidad,
                      }
                    : item,
            );

            setAllProducts(updatedProducts);
        } else {
            const newProduct = {
                ...product,

                variante_id: selectedVariant.id,
                talle: selectedVariant.talle,
                stock: selectedVariant.stock,

                Cantidad: quantity,
            };

            setAllProducts([...allProducts, newProduct]);
        }

        setQuantity(1);
    };

    /*
     * Loading
     */
    if (loading) {
        return (
            <div className='productDetailMessage'>
                <p>Cargando producto...</p>
            </div>
        );
    }

    /*
     * Error
     */
    if (error || !product) {
        return (
            <div className='productDetailMessage'>
                <h2>Producto no encontrado</h2>

                <button onClick={() => navigate("/")}>
                    Volver al catálogo
                </button>
            </div>
        );
    }

    /*
     * Variantes ordenadas
     */
    const sortedVariants = sortVariants(product.variantes || []);

    return (
        <main className='productDetail'>
            {/* VOLVER */}
            <button className='backButton' onClick={() => navigate("/")}>
                <AiOutlineArrowLeft />
                Volver al catálogo
            </button>

            {/* PRODUCTO */}
            <section className='productDetailContainer'>
                {/* IMAGEN */}
                <div className='productDetailImage'>
                    <img src={product.imagen} alt={product.nombre} />
                </div>

                {/* INFORMACIÓN */}
                <div className='productDetailInfo'>
                    <span className='productCategory'>
                        {product.categoria_nombre}
                    </span>

                    <h1>{product.nombre}</h1>

                    <p className='productDescription'>{product.descripcion}</p>

                    <div className='productPrince'>
                        ${Number(product.precio).toLocaleString("es-AR")}
                    </div>

                    {/* TALLES */}
                    <div className='productSizeSelector'>
                        <strong>Talle:</strong>

                        <div className='sizeOptions'>
                            {sortedVariants.map((variant) => (
                                <button
                                    key={variant.id}
                                    type='button'
                                    className={
                                        selectedVariant?.id === variant.id
                                            ? "sizeButton selected"
                                            : "sizeButton"
                                    }
                                    disabled={variant.stock <= 0}
                                    onClick={() => handleVariantChange(variant)}
                                >
                                    {variant.talle}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* STOCK */}
                    <div className='productStock'>
                        {selectedVariant ? (
                            selectedVariant.stock > 0 ? (
                                <>
                                    Stock disponible:{" "}
                                    <strong>{selectedVariant.stock}</strong>
                                </>
                            ) : (
                                "Sin stock"
                            )
                        ) : (
                            "Sin variantes disponibles"
                        )}
                    </div>

                    {/* CANTIDAD */}
                    {selectedVariant && selectedVariant.stock > 0 && (
                        <div className='quantitySelector'>
                            <strong>Cantidad:</strong>

                            <div className='quantityControls'>
                                <button
                                    type='button'
                                    onClick={decreaseQuantity}
                                    disabled={quantity <= 1}
                                >
                                    <AiOutlineMinus />
                                </button>

                                <span>{quantity}</span>

                                <button
                                    type='button'
                                    onClick={increaseQuantity}
                                    disabled={quantity >= selectedVariant.stock}
                                >
                                    <AiOutlinePlus />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* BOTÓN CARRITO */}
                    <button
                        className='detailCarButton'
                        onClick={onAddProduct}
                        disabled={
                            !selectedVariant || selectedVariant.stock <= 0
                        }
                    >
                        {!selectedVariant || selectedVariant.stock <= 0
                            ? "Sin stock"
                            : `Añadir ${quantity} al carrito`}

                        <AiOutlineShoppingCart />
                    </button>
                </div>
            </section>

            {/* CARRUSEL */}
            <section className='carruselProducts'>
                <div className='carruselHeader'>
                    <h2>También te puede interesar</h2>

                    <span>{product.categoria_nombre}</span>
                </div>

                {relatedProducts.length > 0 ? (
                    <div
                        className='carrusel'
                        ref={carruselRef}
                        onMouseEnter={() => {
                            carruselPauseRef.current = true;
                        }}
                        onMouseLeave={() => {
                            carruselPauseRef.current = false;
                        }}
                        onTouchStart={() => {
                            carruselPauseRef.current = true;
                        }}
                        onTouchEnd={() => {
                            setTimeout(() => {
                                carruselPauseRef.current = false;
                            }, 1000);
                        }}
                    >
                        {relatedProducts.map((relatedProduct) => (
                            <CarruselProduct
                                key={relatedProduct.id}
                                product={relatedProduct}
                            />
                        ))}
                    </div>
                ) : (
                    <p className='NoProducts'>
                        No hay otros productos de esta categoría.
                    </p>
                )}
            </section>
        </main>
    );
}

export default ProductDetail;
