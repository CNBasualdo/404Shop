import { useEffect, useState } from "react";
import { getAnuncios } from "../api/anuncios.api";
import "../styles/anuncios.css";

function Anuncios({ posicion }) {
    const [anuncios, setAnuncios] = useState([]);

    useEffect(() => {
        const cargarAnuncios = async () => {
            try {
                const data = await getAnuncios();

                const anunciosFiltrados = data.filter(
                    (anuncio) => anuncio.posicion === posicion,
                );
                setAnuncios(anunciosFiltrados);
            } catch (error) {
                console.error("Error al cargar anuncios", error);
            }
        };
        cargarAnuncios();
    }, [posicion]);

    if (anuncios.length === 0) {
        return null;
    }

    return (
        <section className='anuncios-container'>
            {anuncios.map((anuncio) => (
                <div className='anuncios-card' key={anuncio.id}>
                    <img src={anuncio.imagen} alt={anuncio.titulo} />
                    <div className='anuncio-info'>
                        <h2>{anuncio.titulo}</h2>
                        {anuncio.descripcion && <p>{anuncio.descripcion}</p>}
                    </div>
                </div>
            ))}
        </section>
    );
}

export default Anuncios;
