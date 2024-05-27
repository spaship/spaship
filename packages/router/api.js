const express = require('express');
const router = express.Router();
const { pathMappingsData, loadPathMappings } = require('./pathmapping');
const fsp = require("fs").promises;
const path = require('path');
const config = require("./config");

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const openApiDocumentation = YAML.load('./openapi.yaml');

router.use(express.json());
router.use(express.urlencoded({ extended: true })); // for parsing URL-encoded data from the request body

router.get('/pathMappings', (req, res) => {
    if (pathMappingsData.pathMappings.length === 0) {
        res.json({ message: 'No mapping found' });
    } else {
        res.json(pathMappingsData.pathMappings);
    }
});



router.get('/pathMappings/reload', async(req, res) => {
    await loadPathMappings();
    if (pathMappingsData.pathMappings.length === 0) {
        res.json({ message: 'No mapping found' });
    } else {
        res.json(pathMappingsData.pathMappings);
    }
});



router.post('/pathMappings', (req, res) => {
    const { incoming_path, mapped_with } = req.body;
    const index = pathMappingsData.pathMappings.findIndex(mapping => mapping.incoming_path === incoming_path);
    if (index !== -1) {
        // Modify existing entry
        pathMappingsData.pathMappings[index].mapped_with = mapped_with;
    } else {
        // Add new entry
        pathMappingsData.pathMappings.push({ incoming_path, mapped_with });
    }
    res.json(pathMappingsData.pathMappings);
});


router.put('/pathMappings', async (req, res) => {
    const filePath = path.join(config.get("webroot"), '.routemapping');
    try {
        await fsp.writeFile(filePath, JSON.stringify(pathMappingsData.pathMappings), 'utf8');
        res.json({ message: 'Path mappings successfully written to .routemapping file' });
    } catch (err) {
        res.status(500).json({ message: `Error writing to .routemapping file: ${err}` });
    }
});


router.delete('/pathMappings/:incoming_path', (req, res) => {
    const { incoming_path } = req.params;
    const index = pathMappingsData.pathMappings.findIndex(mapping => mapping.incoming_path === incoming_path);
    if (index !== -1) {
        // Remove the entry
        pathMappingsData.pathMappings.splice(index, 1);
        res.json({ message: `Entry with incoming_path ${incoming_path} successfully deleted` });
    } else {
        res.status(404).json({ message: `Entry with incoming_path ${incoming_path} not found` });
    }
});

router.use('/docs', swaggerUi.serve);
router.get('/docs', swaggerUi.setup(openApiDocumentation));

module.exports = router;