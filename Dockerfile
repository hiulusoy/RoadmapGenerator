# UI Build Stage (Frontend)
FROM node:18-alpine AS ui-build
WORKDIR /app

# Copy client package.json files
COPY client/package*.json ./client/

# Install client dependencies
WORKDIR /app/client
RUN npm ci --legacy-peer-deps

# Copy client source code and build
COPY client/ ./

# Since the outputPath is set to "../build", the build output will be in /app/build
RUN npm run build

# Server Build Stage (Backend)
FROM node:18-alpine AS server-build
WORKDIR /app

# Copy server package.json files
COPY package*.json ./

# Install server dependencies
RUN npm ci

# Final Image
FROM node:18-alpine
WORKDIR /app

# Copy backend source code
COPY . ./

# Remove unnecessary files to keep the image lean
RUN rm -rf client

# Copy backend dependencies from the server-build stage
COPY --from=server-build /app/node_modules ./node_modules

# Copy frontend build output from the ui-build stage
COPY --from=ui-build /app/build ./build

# Expose the application's port
EXPOSE 3000

# Start the backend server
CMD ["npm", "run", "start-server"]
