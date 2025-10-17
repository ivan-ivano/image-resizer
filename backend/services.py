from fastapi import UploadFile
from PIL import Image
import io


class ImageService:
    @staticmethod
    async def resize(file: UploadFile, width: int, height: int) -> bytes:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))

        resized = image.resize((width, height), Image.Resampling.LANCZOS)

        if resized.mode != "RGB":
            resized = resized.convert("RGB")

        img_bytes = io.BytesIO()
        resized.save(img_bytes, format="JPEG", quality=95)

        return img_bytes.getvalue()