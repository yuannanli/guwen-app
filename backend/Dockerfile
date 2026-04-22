FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose the port Railway provides
EXPOSE 8080

# Start gunicorn with access logging
CMD gunicorn --access-logfile - --error-logfile - -w 4 -b 0.0.0.0:${PORT:-8080} app:app
