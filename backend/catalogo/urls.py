from django.urls import path, include
from rest_framework import routers 
from .views import (CategoriaViewSet, ProductoViewSet, AnuncioViewSet, confirmar_compra)


router = routers.DefaultRouter()

router.register(r"categorias", CategoriaViewSet)
router.register(r"productos", ProductoViewSet)
router.register(r"anuncios", AnuncioViewSet)


urlpatterns = [
    path("", include(router.urls)),

    path("confirmar-compra/", confirmar_compra, name="confirmar-compra")
]