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

router.get('/path-mapping', (req, res) => {
    if (pathMappingsData.pathMappings.length === 0) {
        res.json({ message: 'No mapping found' });
    } else {
        res.json(pathMappingsData.pathMappings);
    }
});



router.get('/path-mapping/reload', async(req, res) => {
    await loadPathMappings();
    if (pathMappingsData.pathMappings.length === 0) {
        res.json({ message: 'No mapping found' });
    } else {
        res.json(pathMappingsData.pathMappings);
    }
});



router.post('/path-mapping', (req, res) => {
    const { virtualPath, mappedTo } = req.body;
    const index = pathMappingsData.pathMappings.findIndex(mapping => mapping.virtualPath === virtualPath);
    if (index !== -1) {
        // Modify existing entry
        pathMappingsData.pathMappings[index].mappedTo = mappedTo;
    } else {
        // Add new entry
        pathMappingsData.pathMappings.push({ virtualPath, mappedTo });
    }
    res.json(pathMappingsData.pathMappings);
});


router.put('/path-mapping', async (req, res) => {
    const filePath = path.join(config.get("webroot"), '.routemapping');
    try {
        await fsp.writeFile(filePath, JSON.stringify(pathMappingsData.pathMappings), 'utf8');
        res.json({ message: 'Path mappings successfully written to .routemapping file' });
    } catch (err) {
        res.status(500).json({ message: `Error writing to .routemapping file: ${err}` });
    }
});


router.delete('/path-mapping/:virtualPath', (req, res) => {
    const { virtualPath } = req.params;
    const index = pathMappingsData.pathMappings.findIndex(mapping => mapping.virtualPath === virtualPath);
    if (index !== -1) {
        // Remove the entry
        pathMappingsData.pathMappings.splice(index, 1);
        res.json({ message: `Entry with virtualPath ${virtualPath} successfully deleted` });
    } else {
        res.status(404).json({ message: `Entry with virtualPath ${virtualPath} not found` });
    }
});

if(config.get("show_docs")) {
    router.use('/docs', swaggerUi.serve);
    router.get('/docs', swaggerUi.setup(openApiDocumentation));
}

module.exports = router;