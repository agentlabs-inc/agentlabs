FROM python:3.11.5-bookworm as build

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update && \
	apt-get install -y --no-install-recommends \
	build-essential	\
	python3-dev \
	libssl-dev

COPY requirements.txt .

RUN pip install --upgrade pip && \
    pip install -r requirements.txt

WORKDIR /app

COPY . /app/

ENTRYPOINT ["python", "src/app.py"]
