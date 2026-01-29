# Stage 1: Build & Dependencies
# CHUYỂN SANG node:22-slim (Debian) để khắc phục lỗi Rollup/Vite native
FROM node:22-slim AS builder 
WORKDIR /app

# ⚠️ LƯU Ý: Nếu pdftotext cần cho quá trình build, bạn phải cài bằng lệnh Debian:
# RUN apt-get update && apt-get install -y poppler-utils 

# Khai báo ARG/ENV (Giữ nguyên)
ARG VITE_API_BASE_URL 
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL 
ARG VITE_GOOGLE_CLIENT_ID 
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID 
ARG VITE_SOCKET_URL 
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL 

# Copy và cài đặt Node dependencies
COPY package.json package-lock.json ./
RUN npm install 

# Thêm bước xóa và cài lại để khắc phục bug npm với optional dependencies
RUN rm -rf node_modules package-lock.json && npm install

# Copy source code và Build (Sẽ thành công trên Debian Slim)
COPY . .
RUN npm run build 

# Stage 2: Production Final Image (Giữ Nginx Alpine để image nhẹ hơn)
# Stage 2 không cần pdftotext trừ khi Nginx hoặc file HTML cần nó.
FROM nginx:alpine AS runner 

# Copy file build từ builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy file cấu hình custom cho SPA (nginx.conf)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]