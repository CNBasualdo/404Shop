from django.db import transaction
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import (
    ProductoSerializer,
    CategoriaSerializer,
    AnuncioSerializer
)

from .models import Producto, Categoria, Anuncio, VarianteProducto


class CategoriaViewSet(viewsets.ModelViewSet):

    queryset = Categoria.objects.all().order_by("nombre")
    serializer_class = CategoriaSerializer


class ProductoViewSet(viewsets.ModelViewSet):

    queryset = (
        Producto.objects
        .select_related("categoria")
        .all()
        .order_by("nombre")
    )

    serializer_class = ProductoSerializer


class AnuncioViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = Anuncio.objects.filter(activo=True)
    serializer_class = AnuncioSerializer


@api_view(["POST"])
def confirmar_compra(request):

    productos = request.data.get("productos", [])

    if not productos:
        return Response(
            {"error": "No hay productos en la compra."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        with transaction.atomic():

            for producto in productos:

                variante_id = producto.get("variante_id")
                cantidad = producto.get("cantidad")

                if not variante_id or not cantidad:
                    return Response(
                        {"error": "Datos de producto incompletos."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                try:
                    cantidad = int(cantidad)
                except (TypeError, ValueError):
                    return Response(
                        {"error": "La cantidad no es válida."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                if cantidad <= 0:
                    return Response(
                        {"error": "La cantidad debe ser mayor a cero."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                variante = (
                    VarianteProducto.objects
                    .select_for_update()
                    .get(id=variante_id)
                )

                if variante.stock < cantidad:
                    return Response(
                        {
                            "error": (
                                f"No hay suficiente stock para "
                                f"{variante.producto.nombre} "
                                f"talle {variante.talle}."
                            )
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

                variante.stock -= cantidad
                variante.save(update_fields=["stock"])

        return Response(
            {
                "mensaje": "Compra confirmada correctamente."
            },
            status=status.HTTP_200_OK
        )

    except VarianteProducto.DoesNotExist:

        return Response(
            {"error": "Una de las variantes no existe."},
            status=status.HTTP_404_NOT_FOUND
        )

    except Exception as error:

        return Response(
            {"error": str(error)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )