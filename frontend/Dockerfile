# Imagen base
FROM node:20-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el frontend
COPY . .

# Exponer puerto 3000
EXPOSE 3000

# Comando para desarrollo
CMD ["npm", "run", "dev"]

# Para producción:
# RUN npm run build
# CMD ["npm", "run", "start"]
