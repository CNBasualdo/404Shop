from django.db import models

# Create your models here.
class Categoria(models.Model):
    nombre = models.CharField(max_length=50, unique=True)

    class Meta:
        verbose_name = "Categoria"
        verbose_name_plural = "Categorias"
        ordering =["nombre"]

    def __str__(self):
        return self.nombre


class Producto(models.Model):

    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.CASCADE,
        related_name="productos"
    )
    nombre = models.CharField(max_length=100)

    descripcion = models.TextField(max_length=800, blank=True)

    imagen = models.ImageField(
        upload_to="productos/",
        null=True,
        blank=True
    )


    precio = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering =["nombre"]
        verbose_name ="Producto"
        verbose_name_plural = "Productos"

    def __str__(self):
        return self.nombre


class VarianteProducto(models.Model):

    producto = models.ForeignKey(
        Producto,
        on_delete=models.CASCADE,
        related_name="variantes"
    )

    talle = models.CharField(
        max_length=10
    )

    stock = models.PositiveIntegerField(
        default=0
    )

    class Meta:
        ordering = ["talle"]

        verbose_name = "Variante de producto"
        verbose_name_plural = "Variantes de productos"

        constraints = [
            models.UniqueConstraint(
                fields=["producto", "talle"],
                name="producto_talle_unico"
            )
        ]

    def __str__(self):
        return f"{self.producto.nombre} - Talle {self.talle}"


class Anuncio(models.Model):
    POSICIONES =[
        ("top", "Superior"),
        ("middle", "Intermedio"),
        ("bottom", "inferior"),
    ]

    titulo = models.CharField(max_length=150)
    descripcion = models.TextField(
        blank=True,
        null=True
    )

    imagen = models.ImageField(
        upload_to="anuncios/"
    )

    posicion = models.CharField(
        max_length=20,
        choices=POSICIONES,
        default="top"
    )

    activo = models.BooleanField(
        default=True
    )

    fecha_inicio = models.DateTimeField(
        blank=True,
        null=True
    )

    fecha_fin = models.DateTimeField(
        blank= True,
        null= True
    )
    creado = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.titulo