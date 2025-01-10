FROM python:3.12-alpine

WORKDIR /app

# Copy requirements first for caching
COPY requirements.txt .

# Install dependencies; --no-cache-dir avoids caching packages in the image
RUN pip install --no-cache-dir -r requirements.txt

# Copy rest of the code
COPY . .

# Expose port 5000 for the server
EXPOSE 5000

# Run the Flask app (adjust "app.py" / "main.py" as needed)
CMD ["python", "src/app.py"]