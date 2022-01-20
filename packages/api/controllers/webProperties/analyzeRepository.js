const Git = require("nodegit");
const path = require("path");
const fs = require("fs");
const { uuid } = require("uuidv4");
const config = require("../../config");

const delay = (millis) =>
  new Promise((resolve, reject) => {
    setTimeout((_) => resolve(), millis);
  });

module.exports = async function gitOperations(req, res, next) {
  try {
    const directoryName = `spaship_temp_${uuid()}`;
    const basePath = config.get("directoryBasePath");
    const delimiter = "../..";
    const pathClone = path.resolve(__dirname, `${delimiter}/${basePath}/${directoryName}`).trim();
    const resolvePathCreateBranch = path.resolve(__dirname, `${delimiter}/${basePath}/${directoryName}/.git`).trim();
    await cloneGitRepository(req.body.repositoryLink, pathClone);
    await checkoutRemoteBranch(req.body.branch, resolvePathCreateBranch);

    console.log(`Directory name : ${directoryName}`);
    console.log(`Path Clone : ${pathClone}`);
    console.log(`Resolve Path Create Branch : ${resolvePathCreateBranch}`);
    console.log(`System Dir Name : ${__dirname}`);

    let filepaths = [];
    let responseFiles = [];
    filepaths = await walk(pathClone, filepaths);
    responseFiles = await getAnalyzedFiles(filepaths, responseFiles, pathClone);
    res.send({ analyzedFiles: responseFiles });
  } catch (err) {
    next(err);
    return;
  }
};

async function getAnalyzedFiles(filepaths, responseFiles, pathClone) {
  for (let analyzeScript of filepaths) {
    await readFileAnalyze(analyzeScript, responseFiles, pathClone);
  }
  return responseFiles;
}

async function readFileAnalyze(analyzeScript, responseFiles, pathClone) {
  return new Promise((resolve, reject) => {
    fs.readFile(analyzeScript, "utf8", function (err, data) {
      if (err) {
        reject(err);
        throw new Error("Issue in git repository!");
      }
      if (data.includes("react") || data.includes("vue") || data.includes("angular")) {
        console.log(pathClone);
        console.log(analyzeScript);
        analyzeScript = analyzeScript.replace(pathClone, "");
        analyzeScript = analyzeScript.replace("/package.json", "");
        responseFiles.push(analyzeScript);
      }
      resolve(data);
    });
  });
}

async function walk(pathClone, filepaths) {
  console.log(pathClone);
  const files = fs.readdirSync(pathClone);
  for (let filename of files) {
    if (filename == ".git") continue;
    const filepath = path.join(pathClone, filename);
    if (fs.statSync(filepath).isDirectory()) {
      try {
        walk(filepath, filepaths);
      } catch (err) {
        console.log(err);
        throw new Error("SPA Path is not valid !");
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
  console.log("checkoutRemoteBranch : ", resolvePathCreateBranch);
  Git.Repository.open(resolvePathCreateBranch)
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
          throw new Error("Git Operations Issue!");
        });
    })
    .then(() => {
      console.log(`Checking out Remote branch refs/remotes/origin/${remoteBranch}`);
    })
    .catch((err) => {
      console.log(err);
      throw new Error("Git Operations Issue!");
    });
  await delay(100);
}

async function cloneGitRepository(repositoryLink, pathClone) {
  console.log("Cloning Repository " + repositoryLink);
  console.log("Cloning at path : ", pathClone);
  return Git.Clone(repositoryLink, pathClone).catch(function (err) {
    console.log(err);
    throw new Error("Invalid Repository URL !");
  });
}
