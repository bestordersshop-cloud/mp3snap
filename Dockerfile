# Build stage
FROM node:22-slim AS builder

WORKDIR /app

COPY package.json ./
# Generate a package-lock.json if it doesn't exist, or just use package.json
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:22-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    python3-pip \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

COPY package.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

# Railway provides the PORT environment variable
ENV PORT=3000
EXPOSE ${PORT}

CMD ["node", "dist/index.js"]
