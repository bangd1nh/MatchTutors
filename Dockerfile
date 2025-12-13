# Stage 1: Build & Dependencies
FROM node:22-slim AS builder 
WORKDIR /app

# Khai báo ARG/ENV cho biến môi trường Vite 
ARG VITE_API_BASE_URL 
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL 
ARG VITE_GOOGLE_CLIENT_ID 
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID 

# Copy và cài đặt Node dependencies
COPY package.json package-lock.json ./
RUN npm ci # Hoặc npm install

# Copy source code và Build (Sẽ thành công trên Debian Slim)
COPY . .
RUN npm run build 

# Stage 2: Production Final Image (Sử dụng Nginx Alpine cho Frontend)
FROM nginx:alpine AS runner

# Copy file build từ builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy file cấu hình custom cho SPA (nginx.conf)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]