const Git = require("nodegit");
const path = require("path");
const fs = require("fs");
const { uuid } = require("uuidv4");
const config = require("../../config");

const delay = (millis) =>
  new Promise((resolve, reject) => {
    setTimeout((_) => resolve(), millis);
  });

module.exports = async function gitOperations(req, res) {
  const directoryName = `spaship_temp_${uuid()}`;
  const basePath = config.get("directoryBasePath");
  const pathClone = path.resolve(__dirname, `./../../../${basePath}/${directoryName}`);
  const resolvePathCreateBranch = `../../../${basePath}/${directoryName}/.git`;
  const analyzePath = `../../../${basePath}/${directoryName}`;
  const pathFile = `${basePath}/${directoryName}/`;
  await cloneGitRepository(req.body.repositoryLink, pathClone);
  await checkoutRemoteBranch(req.body.branch, resolvePathCreateBranch);

  console.log(`Directory name : ${directoryName}`);
  console.log(`Path Clone : ${pathClone}`);
  console.log(`Eesolve Path Create Branch : ${resolvePathCreateBranch}`);
  console.log(`Path File : ${pathFile}`);
  console.log(`Resolved Path : `, path.resolve(__dirname, `./../../../${basePath}/${directoryName}.zip`));
  console.log(`System Dir Name : ${__dirname}`);

  let filepaths = [];
  let responseFiles = [];
  filepaths = await walk(analyzePath, filepaths);
  responseFiles = await getAnalyzedFiles(filepaths, responseFiles, analyzePath);
  res.send({ analyzedFiles: responseFiles });
};

function getWebPropertyName(req) {
  return req?.body?.webPropertyName || "";
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
      if (data.includes("react") || data.includes("vue") || data.includes("angular")) {
        console.log(path.resolve(__dirname, analyzePath));
        console.log(analyzeScript);
        analyzeScript = analyzeScript.replace(path.resolve(__dirname, analyzePath), "");
        analyzeScript = analyzeScript.replace("/package.json", "");
        responseFiles.push(analyzeScript);
      }
      resolve(data);
    });
  });
}

async function walk(analyzePath, filepaths) {
  const files = fs.readdirSync(path.resolve(__dirname, analyzePath));
  for (let filename of files) {
    if (filename == ".git") continue;
    const filepath = path.join(path.resolve(__dirname, analyzePath), filename);
    if (fs.statSync(filepath).isDirectory()) {
      try {
        walk(filepath, filepaths);
      } catch (err) {
        console.log("e");
        console.log(err);
      }
    } else if (path.extname(filename) === ".json") {
      if (filepath.includes("package.json")) {
        filepaths.push(filepath);
      }
    }
  }
  return filepaths || [];
}

async function checkoutRemoteBranch(remoteBranch, resolvePathCreateBranch) {
  await delay(100);
  Git.Repository.open(path.resolve(__dirname, resolvePathCreateBranch))
    .then((repo) => {
      return repo
        .getHeadCommit()
        .then((targetCommit) => {
          return repo.createBranch(remoteBranch, targetCommit, false);
        })
        .then((reference) => {
          return repo.checkoutBranch(reference, {});
        })
        .then(() => {
          return repo.getReferenceCommit("refs/remotes/origin/" + remoteBranch);
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

function createSignature(localBranch) {
  return Git.Signature.now("spaship-deployment", localBranch);
}

async function cloneGitRepository(repositoryLink, pathClone) {
  console.log("Cloning Repository " + repositoryLink);
  console.log("Cloning at path : ", pathClone);
  return Git.Clone(repositoryLink, pathClone).catch(function (err) {
    console.log(err);
  });
}