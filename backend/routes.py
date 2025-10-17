from fastapi import APIRouter, File, UploadFile, Query
from fastapi.responses import Response
from services import ImageService

router = APIRouter()


@router.post("/resize/")
async def resize_image(
        file: UploadFile = File(...),
        width: int = Query(..., gt=0),
        height: int = Query(..., gt=0)
):
    img_bytes = await ImageService.resize(file, width, height)

    return Response(
        content=img_bytes,
        media_type="image/jpeg",
        headers={
            "Content-Disposition": "attachment; filename=resized.jpg"
        }
    )