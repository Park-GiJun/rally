# ── build ──
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
# package-lock.json 미사용 프로젝트(client/web CLAUDE.md = npm install 흐름) → ci 대신 install.
RUN npm install
COPY . .
RUN npm run build

# ── serve (nginx) ──
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
