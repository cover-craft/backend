from pydantic import BaseModel
from typing import Optional
from fastapi import HTTPException
import os 
import replicate
import requests
import base64

from .utils import image2string
from .prompt_generation import making_prompt

import io
from dotenv import load_dotenv

load_dotenv()

class Txt2img(BaseModel):
    # model: Optional[str] 
    prompt: Optional[str] 
    negative_prompt: Optional[str] = "Bad drawn face, ugly, bad face, mutation, extra limbs, bad drawn mouth, bad mouth, bad eyes, extra eyes, (cartoon, 3d, bad art, poorly drawn), (disfigured, deformed, extra limbs:1.5), (bad hands), (mutated hands and fingers), bad feet, bad face. watermark." 
    height: Optional[int] = 768
    width: Optional[int] = 512
    scheduler: Optional[str] = 'DPMSolverMultistep'
    num_inference_steps: Optional[int] = 20 
    guidance_scale: Optional[int] = 12
    number_of_imgs: Optional[int] = 1 
    imgs : Optional[str] = [] 
    seeds : Optional[int] = 0

def making_cover_stable_diffusion_txt2img(txt2img: Txt2img):
    REPLICATE_API_TOKEN = os.environ.get('REPLICATE_API_TOKEN')

    # model = select_model(txt2img.model)

    # generator = [torch.Generator().manual_seed(0) for i in range(txt2img.number_of_imgs)]
    # txt2img.seeds = [generator[i].seed() for i in range(txt2img.number_of_imgs)]

    # pipe = StableDiffusionPipeline.from_pretrained(model, torch_dtype=torch.float32).to("cuda")

    prompt = making_prompt(txt2img.prompt)

    # pipe.enable_xformers_memory_efficient_attention()

    # with torch.inference_mode():
    #     imgs = pipe(prompt=prompt, negative_prompt=txt2img.negative_prompt, 
    #             height=txt2img.height, width=txt2img.width, num_inference_steps=txt2img.num_inference_steps, 
    #             num_images_per_prompt=txt2img.number_of_imgs, guidance_scale=txt2img.guidance_scale, generator=generator).images        
   
    #     for i, img in enumerate(imgs):
    #         if not os.path.exists('./app/images'):
    #             os.makedirs('./app/images')

    #         file_name = "./app/images/{}_{}_{}.png".format(txt2img.prompt, txt2img.seeds[i], i)
    #         img.save(file_name)
    #         string_img = image2string(img)
    #         print(string_img)
    #         txt2img.imgs.append(string_img)

    iterator = replicate.run(
    "elct9620/pastel-mix:ba8b1f407cd6418fa589ca73e5c623c081600ecff19f7fc3249fa536d762bb29",
    input={"prompt": prompt, "negative_prompt": txt2img.negative_prompt, "width": txt2img.width, "height": txt2img.height, \
    "num_inference_steps": txt2img.num_inference_steps, "num_outputs": txt2img.number_of_imgs, \
    "scheduler": txt2img.scheduler, "guidance_scale": txt2img.guidance_scale, "seed": txt2img.seeds}
    )

    for image in iterator:
      res = requests.get(image)
      string_img = base64.encodebytes(res.content).decode('ascii')
      txt2img.imgs.append(string_img)
        
      return txt2img

# def select_model(model_name):
#     if model_name == "stable-diffusion":
#         model = "runwayml/stable-diffusion-v1-5"
#     elif model_name == "anything":
#         model = "andite/anything-v4.0"
#     elif model_name == "pastelmix":
#         model = "JamesFlare/pastel-mix"
#     else:
#         raise HTTPException(status_code=404, detail="Model not found")
#     return model