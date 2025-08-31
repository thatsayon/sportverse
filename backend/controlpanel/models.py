from django.db import models
from cloudinary.models import CloudinaryField
import uuid

class Sport(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    name = models.CharField(
        max_length=50,
        unique=True
    )
    slug = models.SlugField(
        max_length=60, 
        unique=True, 
        blank=True
    )
    image = CloudinaryField('admin/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
