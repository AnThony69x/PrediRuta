# Imagen base
FROM node:22.18.0-alpine

# Mejor compatibilidad con binarios nativos
RUN apk add --no-cache libc6-compat

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json si existe
COPY package*.json ./

# Instalar dependencias
# Para desarrollo puedes usar npm install; para producción se recomienda npm ci
RUN npm install

# Copiar todo el frontend
COPY . .

# Exponer puerto 3000
EXPOSE 3000

# Comando por defecto: desarrollo
CMD ["npm", "run", "dev"]

# Para producción (descomenta para imagen de prod):
# RUN npm run build
# CMD ["npm", "run", "start"]