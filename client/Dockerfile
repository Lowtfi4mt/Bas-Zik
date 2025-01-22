FROM node:18-slim

WORKDIR /app

# Copy only package files first to take advantage of Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy remaining source files
COPY . .

# Expose port 5173 for the Vite development server
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev"]