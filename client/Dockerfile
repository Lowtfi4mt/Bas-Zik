# --- Stage 1: Build the Preact app ---
  FROM node:18-alpine AS build

  WORKDIR /app
  
  # Copy only package files first to take advantage of Docker caching
  COPY package*.json ./
  
  # Install dependencies
  RUN npm install
  
  # Copy remaining source files
  COPY . .
  
  # Build the production-optimized Preact assets
  RUN npm run build
  
  # --- Stage 2: Run with an Nginx server (small Alpine-based) ---
  FROM nginx:stable-alpine
  
  # Remove default Nginx website
  RUN rm -rf /usr/share/nginx/html/*
  
  # Copy build assets from stage 1
  COPY --from=build /app/dist /usr/share/nginx/html
  
  # Expose port 80 for the client
  EXPOSE 80
  
  # Launch Nginx in the foreground
  CMD ["nginx", "-g", "daemon off;"]