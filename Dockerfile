# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Salin dependency file
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Salin semua file project
COPY . .

# Build aplikasi Next.js
RUN npm run build

# Jalankan aplikasi
EXPOSE 3000
CMD ["npm", "start"]