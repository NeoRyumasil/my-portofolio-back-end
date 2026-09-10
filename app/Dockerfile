# Bun Image
FROM oven/bun:latest as builder

# Work Directory
WORKDIR /app

# Copy Packages
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --production

# Copy Files
COPY . .

# Port 
EXPOSE 3001

# Run Server
CMD ["bun", "run", "index.ts"]