FROM python:3.9.7

WORKDIR /code/gen

COPY ./requirements.txt /code/gen/requirements.txt

RUN pip install --no-cache-dir -r /code/gen/requirements.txt

COPY ./app /code/gen/app

EXPOSE 8000   

CMD ["uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]