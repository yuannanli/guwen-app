FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Use exec form with /bin/sh -c to ensure PORT is expanded at runtime
CMD ["/bin/sh", "-c", "echo Starting on PORT=$PORT && gunicorn --access-logfile - --error-logfile - -w 4 -b 0.0.0.0:${PORT:-8080} app:app"]
