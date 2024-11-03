# UI Build Stage (Frontend)
FROM node:18-alpine AS ui-build

# Çalışma dizinini ayarla
WORKDIR /app

# Client package.json ve package-lock.json dosyalarını kopyala
COPY client/package*.json ./client/

# Client bağımlılıklarını yükle
WORKDIR /app/client
RUN npm ci --legacy-peer-deps

# Client kaynak kodunu kopyala
COPY client/ ./

# Frontend'i derle
RUN npm run build

# Server Build Stage (Backend)
FROM node:18-alpine AS server-build

# Çalışma dizinini ayarla
WORKDIR /app

# Server package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# Server bağımlılıklarını yükle
RUN npm ci --legacy-peer-deps

# Server kaynak kodunu kopyala
COPY . ./

# Backend'i derle
RUN npm run build

# Final Image
FROM node:18-alpine

# Çalışma dizinini ayarla
WORKDIR /app

# Backend build çıktısını ve node_modules'u kopyala
COPY --from=server-build /app/dist ./dist
COPY --from=server-build /app/node_modules ./node_modules

# Frontend build çıktısını public klasörüne kopyala
COPY --from=ui-build /app/client/dist/roadmapgenerator ./public

# Uygulamanın çalışacağı portu aç
EXPOSE 3000

# Üretim ortamı değişkenini ayarla
ENV NODE_ENV=production

# Backend sunucusunu başlat
CMD ["npm", "run", "start-server"]
