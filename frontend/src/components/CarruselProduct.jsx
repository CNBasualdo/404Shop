import React from "react";
import "../styles/carruselProduct.css"

import {useNavigate} from "react-router-dom"

function CarruselProduct({product}) {

    const navigate = useNavigate();

    return (
        <div className="carruselCard" onClick={()=>navigate(`/producto/${product.id}`)}>
            <div className="carruselImagenContainer">
                <img src={product.imagen} alt={product.nombre} />
            </div>
            <div className="carruselInfo">
                <h3>{product.nombre}</h3>
                <p>${Number(product.precio).toLocaleString("es-AR")}</p>

            </div>
        </div>
    );
}

export default CarruselProduct;
