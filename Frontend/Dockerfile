# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Build-time frontend env vars (Vite embeds these during npm run build)
ARG VITE_API_URL=/api
ARG VITE_YOUTUBE_API_KEY=
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_YOUTUBE_API_KEY=${VITE_YOUTUBE_API_KEY}

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage - serve with nginx
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
