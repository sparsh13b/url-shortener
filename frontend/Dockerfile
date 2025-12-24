FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .


ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

RUN npm install -g serve

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
