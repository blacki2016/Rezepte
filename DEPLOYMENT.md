# Deployment Guide 🚀

## Local Development

### Prerequisites
- Node.js v16+
- npm or yarn

### Setup
1. Clone the repository
2. Run `npm run install-all` to install all dependencies
3. Copy `.env.example` to `.env`
4. Run `npm run dev` for backend server
5. In a new terminal, run `npm run client` for frontend

## Production Deployment

### Option 1: Traditional Hosting (VPS, EC2, etc.)

1. **Build the frontend:**
```bash
cd client
npm run build
```

2. **Set up environment variables:**
```bash
export NODE_ENV=production
export PORT=5000
```

3. **Start the server:**
```bash
npm start
```

The server will serve the built React app from `client/build`.

### Option 2: Heroku

1. **Create a Heroku app:**
```bash
heroku create your-app-name
```

2. **Add Node.js buildpack:**
```bash
heroku buildpacks:set heroku/nodejs
```

3. **Set environment variables:**
```bash
heroku config:set NODE_ENV=production
```

4. **Add a Procfile:**
```
web: npm start
```

5. **Deploy:**
```bash
git push heroku main
```

### Option 3: Vercel (Frontend) + Serverless Functions (Backend)

1. **Deploy frontend to Vercel:**
```bash
cd client
vercel
```

2. **Convert backend routes to serverless functions** (requires code modification)

### Option 4: Docker

1. **Create Dockerfile:**
```dockerfile
FROM node:16

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build frontend
WORKDIR /app/client
RUN npm install && npm run build

WORKDIR /app

EXPOSE 5000

CMD ["npm", "start"]
```

2. **Build and run:**
```bash
docker build -t rezepte-app .
docker run -p 5000:5000 rezepte-app
```

## Database Setup (Optional)

For production use, integrate MongoDB:

1. **Install MongoDB** or use MongoDB Atlas

2. **Update server/index.js:**
```javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
```

3. **Create models** in `server/models/`

## Environment Variables

Required for production:
- `NODE_ENV=production`
- `PORT=5000`

Optional (for AI features):
- `OPENAI_API_KEY=your_key_here`

Optional (for database):
- `MONGODB_URI=your_mongodb_connection_string`

## Security Considerations

1. **Enable CORS properly** for production domains
2. **Add rate limiting** to prevent abuse
3. **Add authentication** for user-specific features
4. **Validate all inputs** on the server
5. **Use HTTPS** in production
6. **Store sensitive data** in environment variables

## Performance Optimization

1. **Enable compression** in Express
2. **Use a CDN** for static assets
3. **Add caching** for API responses
4. **Optimize images** before uploading
5. **Use lazy loading** for React components

## Monitoring

1. **Add error tracking** (e.g., Sentry)
2. **Set up logging** (e.g., Winston)
3. **Monitor uptime** (e.g., UptimeRobot)
4. **Track analytics** (e.g., Google Analytics)

## Backup Strategy

1. **Regular database backups**
2. **Version control** for code
3. **Environment variable backups**
