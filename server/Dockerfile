FROM python:3.12-slim


# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
WORKDIR /app
COPY . .

EXPOSE 5000

ENV PYTHONPATH=/app/src

# CMD ["python", "src/app.py"]
CMD ["gunicorn", "-w", "4","-b", "0.0.0.0:5000", "app:flask_app"]
