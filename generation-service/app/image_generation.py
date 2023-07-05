from pydantic import BaseModel
from diffusers import StableDiffusionPipeline
import torch
from PIL import Image
import random
from typing import Optional
from fastapi import HTTPException
import os 

from .utils import image2string
from .prompt_generation import making_prompt

import io

class Txt2img(BaseModel):
    model: Optional[str]
    prompt: Optional[str] 
    negative_prompt: Optional[str] 
    height: Optional[int] = 720
    width: Optional[int] = 1064
    num_inference_steps: Optional[int] = 30 
    guidance_scale: Optional[int] = 7.5 
    number_of_imgs: Optional[int] = 1 
    imgs : Optional[str] = [] 
    seeds : Optional[int] = []

def making_cover_stable_diffusion_txt2img(txt2img: Txt2img):

    model = select_model(txt2img.model)

    generator = [torch.Generator().manual_seed(0) for i in range(txt2img.number_of_imgs)]
    txt2img.seeds = [generator[i].seed() for i in range(txt2img.number_of_imgs)]

    pipe = StableDiffusionPipeline.from_pretrained(model, torch_dtype=torch.float32)#.to("cuda")

    prompt = making_prompt(txt2img.prompt)

    # pipe.enable_xformers_memory_efficient_attention()

    with torch.inference_mode():
        imgs = pipe(prompt=prompt, negative_prompt=txt2img.negative_prompt, 
                height=txt2img.height, width=txt2img.width, num_inference_steps=txt2img.num_inference_steps, 
                num_images_per_prompt=txt2img.number_of_imgs, guidance_scale=txt2img.guidance_scale, generator=generator).images        
   
        for i, img in enumerate(imgs):
            if not os.path.exists('./app/images'):
                os.makedirs('./app/images')

            file_name = "./app/images/{}_{}_{}.png".format(txt2img.prompt, txt2img.seeds[i], i)
            img.save(file_name)
            string_img = image2string(img)
            print(string_img)
            txt2img.imgs.append(string_img)

    return txt2img

def select_model(model_name):
    if model_name == "stable-diffusion":
        model = "runwayml/stable-diffusion-v1-5"
    elif model_name == "anything":
        model = "andite/anything-v4.0"
    elif model_name == "pastelmix":
        model = "JamesFlare/pastel-mix"
    else:
        raise HTTPException(status_code=404, detail="Model not found")
    return model