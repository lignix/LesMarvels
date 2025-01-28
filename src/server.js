import Fastify from 'fastify';
import handlebars from '@fastify/view';
import path from 'path';
import { getData } from './api.js';
import Handlebars from 'handlebars'; // Importation de Handlebars
import { fileURLToPath } from 'url'; // Importer fileURLToPath pour manipuler les URLs

// Utilisation de import.meta.url pour obtenir le répertoire actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({ logger: true });

fastify.register(handlebars, {
    engine: {
        handlebars: Handlebars // Utilisation de l'importation Handlebars ici
    },
    root: path.join(__dirname, '../templates'), // Utilisation de __dirname ici
    layout: 'index.hbs',
    options: {
        partials: {
            header: 'header.hbs',
            footer: 'footer.hbs'
        }
    }
});

fastify.get('/', async (request, reply) => {
    try {
        const url = 'https://gateway.marvel.com/v1/public/characters';
        const data = await getData(url);

        // Filtrer les personnages avec des images valides
        const characters = data.data.results
            .filter(character => character.thumbnail && !character.thumbnail.path.includes('image_not_available'))
            .map(character => ({
                name: character.name,
                description: character.description || 'Pas de description disponible',
                imageUrl: `${character.thumbnail.path}/portrait_xlarge.${character.thumbnail.extension}`
            }));

        // Rendre les données dans le template
        return reply.view('index.hbs', { characters });
    } catch (error) {
        reply.code(500).send('Erreur lors de la récupération des personnages');
    }
});

// Lancer le serveur
const start = async () => {
    try {
        await fastify.listen({ port: 3000, host: '0.0.0.0' });
        console.log('Serveur démarré sur http://localhost:3000');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
