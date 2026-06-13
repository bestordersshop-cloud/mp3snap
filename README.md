# MP3Snap Backend

A scalable backend for converting online videos into downloadable MP3 files.

## Tech Stack

- **Runtime**: Node.js (v22+)
- **Framework**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Queue**: BullMQ with Redis
- **Processing**: FFmpeg & yt-dlp
- **Security**: Helmet, CORS, Rate Limiting, Zod Validation
- **Infrastructure**: Docker & Docker Compose

## Architecture

### 1. API Layer
- `POST /api/analyze`: Extract video metadata (title, duration, formats).
- `POST /api/convert`: Queue a conversion job.
- `GET /api/job/:id`: Check conversion status.
- `GET /api/download/:id`: Secure file download.

### 2. Queue System
Powered by **BullMQ** for reliable background processing:
- **Metadata Worker**: Handles initial URL validation and info extraction.
- **Conversion Worker**: Downloads video streams and converts them to high-quality MP3.
- **Cleanup Worker**: Periodically removes expired files.

### 3. Scalability
- Stateless API design allows horizontal scaling.
- Dedicated workers can be scaled independently based on queue load.
- Redis manages distributed job states.

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js & pnpm (for local development)

### Local Development
1. Clone the repository.
2. Install dependencies: `pnpm install`.
3. Set up environment variables: `cp .env.example .env`.
4. Start development server: `pnpm dev`.

### Docker Deployment
```bash
docker-compose up --build
```

## Security
- **Rate Limiting**: Prevents API abuse.
- **Helmet**: Secure HTTP headers.
- **Input Validation**: Strict schema validation using Zod.
- **Secure Downloads**: Signed URLs or temporary tokens for file access.

## Railway Deployment

This project is ready to be deployed on [Railway](https://railway.app/).

1. Connect your GitHub repository to Railway.
2. Railway will automatically detect the `Dockerfile` and `railway.json`.
3. Add the following environment variables in the Railway dashboard:
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `REDIS_HOST`: Your Redis host.
   - `REDIS_PORT`: Your Redis port.
   - `REDIS_PASSWORD`: Your Redis password (if applicable).
   - `STORAGE_TYPE`: `local` or `s3`.
   - `NODE_ENV`: `production`.
4. Railway will handle the build and deployment process.
