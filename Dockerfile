# Stage 1: Build application
FROM node:20-alpine AS build-stage

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source and build
COPY . .
RUN yarn build

# Stage 2: Production Nginx Server
FROM nginx:alpine AS production-stage

# Remove default nginx html
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
