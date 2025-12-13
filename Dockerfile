# Stage 1: Build 
FROM node:20-alpine AS builder
WORKDIR /app

# Khai báo ARG cho VITE_API_URL 
ARG VITE_API_BASE_URL 
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL 

# ---  BIẾN GOOGLE ---
ARG VITE_GOOGLE_CLIENT_ID 
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID 
# ----------------------------------------

COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve bằng Nginx (Tối ưu hơn 'serve')
FROM nginx:alpine AS runner

# Copy file build từ stage 1 vào thư mục html của nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy file cấu hình custom (để fix lỗi React Router 404 khi refresh)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
