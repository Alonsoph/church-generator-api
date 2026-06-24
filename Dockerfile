FROM mcr.microsoft.com/playwright:v1.61.1-noble

WORKDIR /app

# FFmpeg para el montaje de video
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

# Dependencias Node
COPY package*.json ./
RUN npm ci --omit=dev

# Código
COPY . .

EXPOSE 8080
CMD ["npm", "start"]
