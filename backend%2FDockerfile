FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 80

CMD echo Starting on PORT=$PORT && gunicorn --access-logfile - --error-logfile - -w 4 -b 0.0.0.0:$PORT app:app
