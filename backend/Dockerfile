FROM node:18-alpine

# Install curl for health check
RUN apk add --no-cache curl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose the backend port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]