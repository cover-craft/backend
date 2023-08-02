from dotenv import load_dotenv
from fastapi.applications import FastAPI
from fastapi.datastructures import UploadFile
from fastapi.exceptions import HTTPException
from fastapi.param_functions import File, Body
from fastapi.middleware.cors import CORSMiddleware
from events.utils import S3Service
from utils.utils import *
from dotenv import load_dotenv
import datetime
import os 

load_dotenv()

AWS_ACCESS_KEY = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECREST_KET = os.environ.get("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.environ.get("AWS_REGION")
S3_BUCKET = os.environ.get("S3_BUCKET")

origins = [
    "*"
]

app = FastAPI()

s3_client = S3Service(AWS_ACCESS_KEY, AWS_SECREST_KET, AWS_REGION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload", status_code=200, description="***** Upload png asset to S3 *****")
async def upload(fileobject: UploadFile = File(...)):
    filename = fileobject.filename
    current_time = datetime.datetime.now()
    split_file_name = os.path.splitext(filename)   #split the file name into two different path (string + extention)
    file_name_unique = str(current_time.timestamp()).replace('.','')  #for realtime application you must have genertae unique name for the file
    file_extension = split_file_name[1]  #file extention
    data = fileobject.file._file  # Converting tempfile.SpooledTemporaryFile to io.BytesIO
    uploads3 = await s3_client.upload_fileobj(bucket=S3_Bucket, key= file_name_unique+  file_extension, fileobject=data)
    if uploads3:
        s3_url = f"https://{S3_BUCKET}.s3.{AWS_REGION}.amazonaws.com/{file_name_unique +  file_extension}"
        return {"status": "success", "image_url": s3_url}  #response added 
    else:
        raise HTTPException(status_code=400, detail="Failed to upload in S3")