FROM node:latest
WORKDIR /app
COPY . /app
RUN npm install
CMD ["npm", "start"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD curl -f http://localhost:3000/health || exit 1