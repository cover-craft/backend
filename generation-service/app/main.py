from fastapi import FastAPI

from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware

from starlette.responses import JSONResponse

from .image_generation import Txt2img, making_cover_stable_diffusion_txt2img

from PIL import Image

origins = ["*"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/txt2img")
async def making_cover_txt2img(txt2img: Txt2img):
    global results
    results = making_cover_stable_diffusion_txt2img(txt2img)

    converted_results = jsonable_encoder(results)
    return JSONResponse(content=converted_results)