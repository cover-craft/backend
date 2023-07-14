import os 
import openai
import re 
from dotenv import load_dotenv

load_dotenv()

def making_prompt(input):
    openai.api_key = os.environ.get("OPENAI_API_KEY")

    msg = "The book cover generation function is based on artificial intelligence models Stable Diffusion and ChatGPT. \n \
        The main functions are as follows. \n \n \
        1. Type in ChatGPT to create a Prompt to create an image based on the options selected by the user. \n \
        2. Create the final book cover image using the ChatGPT generated prompt as the input prompt for Stable Diffusion. \n \
        You should generate an input prompt for Stable Diffusion. \n \n \
        Make the input prompt of Stable Diffusion, which includes {}. Write it in between double quotes. It is limited to a sequence of 77 tokens.".format(input)

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo", messages=[{"role": "user", "content": msg}]
    ).choices[0].message.content


    response = re.search('"(.+?)"', response).group(1)

    # print(response)

    return response