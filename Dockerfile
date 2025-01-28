# Étape 1 : Utiliser l'image de base Node.js (version LTS)
FROM node:lts-bullseye-slim

# Étape 2 : Créer l'arborescence de destination et définir le propriétaire
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node

# Étape 3 : Définir le répertoire de travail pour l'application
WORKDIR /home/node/app

# Étape 4 : Copier les fichiers package.json et package-lock.json dans le conteneur
COPY package*.json ./

# Étape 5 : Installer les dépendances de l'application
RUN npm install

# Étape 6 : Copier tout le code source dans le conteneur
COPY . .

# Étape 7 : Exposer le port que Fastify va utiliser
EXPOSE 3000

# Étape 8 : Lancer l'application en démarrant Node.js
CMD ["node", "src/server.js"]
