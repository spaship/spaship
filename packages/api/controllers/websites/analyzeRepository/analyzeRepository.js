var Git = require("nodegit");
var path = require("path");
const fs = require('fs');
const { uuid } = require("uuidv4");
const zip = require('zip-a-folder').zip;
const saveWebsite = require("../saveWebsite");
const config = require('../../../config')
const glob = require('glob');
const { default: strictTransportSecurity } = require("helmet/dist/middlewares/strict-transport-security");

const delay = millis => new Promise((resolve, reject) => {
    setTimeout(_ => resolve(), millis)
});

module.exports = async function gitOperations(req, res) {

    const directoryName = `${req.body.websiteName}_temp_${uuid()}`;
    const pathClone =  path.resolve(__dirname, `./../../../root/${directoryName}`);
    const basePath = config.get("directoryBasePath");
    const resolvePathCreateBranch = `../../../${basePath}/${directoryName}/.git`;
    const analyzePath = `../../../${basePath}/${directoryName}`;
    const pathFile = `root/${directoryName}/`;
    await cloneGitRepository(req.body.repositoryLink, pathClone);
    await checkoutRemoteBranch(req.body.branch, resolvePathCreateBranch);


    console.log(`Directory name : ${directoryName}`);
    console.log(`Path Clone : ${pathClone}`);
    console.log(`Eesolve Path Create Branch : ${resolvePathCreateBranch}`);
    console.log(`Path File : ${pathFile}`);
    console.log(`Resolved Path : `, path.resolve(__dirname, `./../../../root/${directoryName}.zip`));
    console.log(`System Dir Name : ${__dirname}`);

    let filepaths = [];
    let responseFiles = [];
    filepaths = await walk(analyzePath, filepaths);
    responseFiles = await getAnalyzedFiles(filepaths, responseFiles, analyzePath);
    res.send({ analyzedFiles : responseFiles });
}


async function getAnalyzedFiles(filepaths, responseFiles, analyzePath) {
    for (let analyzeScript of filepaths) {
        await readFileAnalyze(analyzeScript, responseFiles, analyzePath);
    }
    return responseFiles;
}

async function readFileAnalyze(analyzeScript, responseFiles, analyzePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(analyzeScript, "utf8", function (err, data) {
            if (err) {
                reject(err);
            }
            if (data.includes('react') || data.includes('vue') || data.includes('angular')) {
                console.log(path.resolve(__dirname, analyzePath));
                console.log(analyzeScript);
                analyzeScript = analyzeScript.replace(path.resolve(__dirname, analyzePath), '')
                analyzeScript = analyzeScript.replace('/package.json', '')
                responseFiles.push(analyzeScript);
            }
            resolve(data);
        });
    });
}

async function walk(analyzePath, filepaths) {
    const files = fs.readdirSync(path.resolve(__dirname, analyzePath));
    for (let filename of files) {
        if (filename == '.git')
            continue;
        const filepath = path.join(path.resolve(__dirname, analyzePath), filename);
        if (fs.statSync(filepath).isDirectory()) {
            try {
                walk(filepath, filepaths);
            }
            catch (err) {
                console.log("e")
                console.log(err);
            }
        } else if (path.extname(filename) === '.json') {
            if (filepath.includes('package.json')) {
                filepaths.push(filepath);
            }

        }
    }
    return filepaths;
}


async function checkoutRemoteBranch(remoteBranch, resolvePathCreateBranch) {
    await delay(100);
    Git.Repository.open(path.resolve(__dirname, resolvePathCreateBranch))
        .then((repo) => {
            return repo.getHeadCommit()
                .then((targetCommit) => {
                    return repo.createBranch(remoteBranch, targetCommit, false);
                })
                .then((reference) => {
                    return repo.checkoutBranch(reference, {});
                })
                .then(() => {
                    return repo.getReferenceCommit('refs/remotes/origin/' + remoteBranch);
                })
                .then((commit) => {
                    Git.Reset.reset(repo, commit, 3, {});
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .then(() => {
            console.log(`Checking out Remote branch refs/remotes/origin/${remoteBranch}`);
        })
        .catch((err) => {
            console.log(err);
        });
    await delay(100);
}

async function createSPAShipTemplateRequest(req, pathFile) {
    await delay(100);
    const spashipTemplate = [];
    const envs = new Set();

    for (let spa of req.body.repositoryConfigs[0].spas) {
        const spaTemplate = {
            name: spa.spaName,
            mapping: spa.contextPath,
            excludeFromEnvs: [],
        };

        spa.envs.forEach(envs.add, envs);
        spashipTemplate.push(spaTemplate);

        const spaShipFile = {
            websiteVersion: "v1",
            websiteName: req.body.websiteName,
            environments: spa.envs,
            branch: req.body.repositoryConfigs[0].branch,
            name: spa.spaName,
            mapping: spa.contextPath,
            excludeFromEnvs: spa.envs,
        };
        console.log(spaShipFile)
        fs.writeFileSync(`${pathFile}${spa.spaName}/.spaship`, JSON.stringify(spaShipFile, null, "\t"));
        console.log(`./spaship added at ${pathFile}${spa.spaName}`)
    }
}

function createSignature(localBranch) {
    return Git.Signature.now("spaship-deployment",
        localBranch);
}

async function cloneGitRepository(repositoryLink, pathClone) {
    console.log("Cloning Repository " + repositoryLink);
    console.log("Cloning at path : ", pathClone)
    return Git.Clone(repositoryLink, pathClone)
        .catch(function (err) { console.log(err); });
}