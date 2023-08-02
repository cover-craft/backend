FROM python:3.9.7

WORKDIR /code/s3

COPY ./requirements.txt /code/s3/requirements.txt

RUN pip install --no-cache-dir -r /code/s3/requirements.txt

COPY ./app /code/s3/app

EXPOSE 8100   

CMD ["uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8100"]