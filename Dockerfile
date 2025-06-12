# ---------- Builder Stage ----------
    FROM node:18-alpine AS builder

    WORKDIR /app
    
    # Use a faster and more reliable mirror if needed
    RUN npm config set registry https://registry.npmmirror.com
    
    # Install dependencies
    COPY package*.json ./
    RUN npm ci
    
    # Copy source code and compile
    COPY . .
    RUN npm run build
    
    # ---------- Production Stage ----------
    FROM node:18-alpine
    
    WORKDIR /app
    
    # Use mirror again to improve reliability (optional)
    RUN npm config set registry https://registry.npmmirror.com
    
    # Copy only necessary files
    COPY package*.json ./
    
    # Set production environment and install only prod dependencies
    ENV NODE_ENV=production
    RUN npm ci --omit=dev
    
    # Copy compiled TypeScript output and PM2 config
    COPY --from=builder /app/dist ./dist
    COPY ecosystem.config.js ./
    
    # Install PM2 globally
    RUN npm install -g pm2
    
    # Set proper permissions (optional for rootless Docker)
    RUN chown -R node:node /app && chmod -R 755 /app
    
    USER node
    
    EXPOSE 5513
    
    CMD ["pm2-runtime", "start", "ecosystem.config.js"]
    