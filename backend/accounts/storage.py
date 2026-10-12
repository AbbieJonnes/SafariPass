import os
import uuid

import cloudinary.uploader
from django.conf import settings
from django.core.files.storage import Storage
from django.utils.deconstruct import deconstructible


@deconstructible
class CloudinaryMediaStorage(Storage):
    """Stores uploaded media on Cloudinary instead of Render's temporary disk."""

    def _save(self, name, content):
        folder = os.path.dirname(name) or 'uploads'
        base = os.path.splitext(os.path.basename(name))[0][:40]
        public_id = f"{folder}/{base}_{uuid.uuid4().hex[:8]}"

        content.seek(0)
        result = cloudinary.uploader.upload(
            content,
            public_id=public_id,
            resource_type='image',
        )
        return f"{result['public_id']}.{result.get('format', 'jpg')}"

    def exists(self, name):
        return False

    def url(self, name):
        if not name:
            return ''
        if name.startswith('http'):
            return name
        return f"https://res.cloudinary.com/{settings.CLOUDINARY_CLOUD_NAME}/image/upload/{name}"

    def delete(self, name):
        pass