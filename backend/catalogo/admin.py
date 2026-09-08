from django.contrib import admin
from .models import Categoria, Producto, VarianteProducto, Anuncio


# =========================================================
# CATEGORÍAS
# =========================================================

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "nombre",
    )

    search_fields = (
        "nombre",
    )

    ordering = (
        "nombre",
    )


# =========================================================
# VARIANTES / TALLES
# =========================================================

class VarianteProductoInline(admin.TabularInline):

    model = VarianteProducto

    extra = 1

    fields = (
        "talle",
        "stock",
    )


# =========================================================
# PRODUCTOS
# =========================================================

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "nombre",
        "categoria",
        "precio",
        "created_at",
    )

    list_filter = (
        "categoria",
    )

    search_fields = (
        "nombre",
        "descripcion",
    )

    ordering = (
        "nombre",
    )

    list_per_page = 15

    inlines = [
        VarianteProductoInline,
    ]


# =========================================================
# VARIANTES
# =========================================================

@admin.register(VarianteProducto)
class VarianteProductoAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "producto",
        "talle",
        "stock",
    )

    list_filter = (
        "talle",
    )

    search_fields = (
        "producto__nombre",
    )

    ordering = (
        "producto",
        "talle",
    )

    list_per_page = 20


# =========================================================
# ANUNCIOS
# =========================================================

@admin.register(Anuncio)
class AnuncioAdmin(admin.ModelAdmin):

    list_display = (
        "titulo",
        "posicion",
        "activo",
        "fecha_inicio",
        "fecha_fin",
        "creado",
    )

    list_filter = (
        "activo",
        "posicion",
    )

    search_fields = (
        "titulo",
        "descripcion",
    )

    ordering = (
        "-creado",
    )

    list_per_page = 15