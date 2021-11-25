const Git = require("nodegit");
const path = require("path");
const fs = require("fs");
const { uuid } = require("uuidv4");
const zip = require("zip-a-folder").zip;
const saveWebProperty = require("./saveWebProperty");
const config = require("../../config");

const delay = (millis) =>
  new Promise((resolve, reject) => {
    setTimeout((_) => resolve(), millis);
  });

module.exports = async function gitOperations(req, res) {
  let repository;
  const directoryName = `spaship_temp_${uuid()}`;
  const basePath = config.get("directoryBasePath");
  const delimiter = "../..";
  const pathClone = path.resolve(__dirname, `${delimiter}/${basePath}/${directoryName}`).trim();
  const resolvePathCreateBranch = path.resolve(__dirname, `${delimiter}/${basePath}/${directoryName}/.git`).trim();
  const localBranch = `${req.body.webPropertyName}_spaship_${uuid()}`;
  const gitToken = req.body.repositoryConfigs[0].gitToken;
  let signature = createSignature(localBranch);

  console.log(`Directory name : ${directoryName}`);
  console.log(`Path Clone : ${pathClone}`);
  console.log(`Resolve Path Create Branch : ${resolvePathCreateBranch}`);
  console.log(`Local Branch : ${localBranch}`);
  console.log(`Resolved Path (zip) : ${pathClone}.zip`);
  console.log(`System Dir Name : ${__dirname}`);
  let webPropertyResponse;
  try {
    await cloneGitRepository(req.body.repositoryConfigs[0].repositoryLink, pathClone);
    await checkoutRemoteBranch(req.body.repositoryConfigs[0].branch, resolvePathCreateBranch);
    await gitCreateBranch(resolvePathCreateBranch, localBranch);
    repository = await gitCheckout(repository, resolvePathCreateBranch, localBranch);
    await createSPAshipTemplateRequest(req, pathClone);
    await gitOperationsCommit(repository, signature, resolvePathCreateBranch, localBranch, gitToken);
    await zipFiles(pathClone, directoryName);
    webPropertyResponse = await saveWebProperty(req, res);
  //  const file = `${pathClone}.zip`;
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
    return;
  }
  res.send({
    actionStatus: "Git Actions Performed Successfully.",
    path: `${config.get("baseurl")}/${directoryName}.zip`,
    webPropertyResponse: webPropertyResponse,
  });
};

async function zipFiles(pathClone, directoryName) {
  console.log(pathClone);
  await zip(pathClone, `${pathClone}.zip`);
}

async function checkoutRemoteBranch(remoteBranch, resolvePathCreateBranch) {
  await delay(100);
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
        });
    })
    .then(() => {
      console.log(`Checking out Remote branch refs/remotes/origin/${remoteBranch}`);
    })
    .catch((err) => {
      console.log(err);
      throw new Error("Issue with Git Reposity !");
    });
  await delay(100);
}

async function createSPAshipTemplateRequest(req, pathFile) {
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
      webPropertyVersion: "v1",
      webPropertyName: req.body.webPropertyName,
      environments: spa.envs,
      branch: req.body.repositoryConfigs[0].branch,
      name: spa.spaName.trim(),
      mapping: spa.contextPath,
      excludeFromEnvs: spa.envs,
    };
    console.log(spaShipFile);
    try{
    fs.writeFileSync(`${pathFile}${spa.spaName.trim()}/.spaship`, JSON.stringify(spaShipFile, null, "\t"));
    }catch(err){
      console.log(err);
      throw new Error("Invalid SPA Path in request body.");
    }
    console.log(`.spaship added at ${pathFile}${spa.spaName.trim()}`);
  }
}

async function gitOperationsCommit(repository, signature, resolvePathCreateBranch, localBranch, gitToken) {
  let index;
  let oid;

  Git.Repository.open(resolvePathCreateBranch)
    .then(function (repo) {
      repository = repo;
      repo
        .getBranch("refs/heads/" + localBranch)
        .then(function (reference) {
          return repo.checkoutRef(reference);
        })
        .catch(function (e) {
          console.log("Error :" + e);
          throw new Error("Git Repository Open Issue !");
        });
    })
    .then(function (repo) {
      repository.getCurrentBranch().then(function (ref) {
        referr = ref;
        console.log("2: Refreshing Index " + ref.shorthand());
      });
      return repository.refreshIndex();
    })
    .then(function (indexResult) {
      console.log("3: Index Result");
      index = indexResult;
    })
    .then(function () {
      console.log("4: Add Index By Path " + resolvePathCreateBranch);
      return index.addAll();
    })
    .then(function () {
      console.log("5: Writting on Index");
      return index.write();
    })
    .then(function () {
      console.log("6: Writting on Tree");
      return index.writeTree();
    })
    .then(function (oidResult) {
      console.log("7: Oid Result " + oidResult);
      oid = oidResult;
      return Git.Reference.nameToId(repository, "HEAD");
    })
    .then(function (head) {
      console.log("8: Head Commit Hash " + head);
      return repository.getCommit(head);
    })
    .then(function (parent) {
      console.log("9: Parent Commit Hash " + parent);
      return repository.createCommit("HEAD", signature, signature, "Commit with Date : " + new Date(), oid, [parent]);
    })
    .then(function () {
      console.log("10: Push Started");
      return repository.getRemote("origin");
    })
    .then(function (remote) {
      return remote.push([`refs/heads/${localBranch}:refs/heads/${localBranch}`], {
        callbacks: {
          credentials: function (url, userName) {
            console.log("11. Authenticate & Git Push");
            return Git.Cred.userpassPlaintextNew(gitToken, "");
          },
        },
      });
    })
    .catch(function (err) {
      console.log(err.toString());
      throw new Error(err.toString());
    });
  return repository;
}

async function gitCheckout(repository, resolvePathCreateBranch, localBranch) {
  Git.Repository.open(resolvePathCreateBranch).then(function (repo) {
    repository = repo;
    repo
      .getBranch("refs/heads/" + localBranch)
      .then(function (reference) {
        console.log("1: Checking out branch " + localBranch);
        console.log(reference);
        return repo.checkoutRef(reference);
      })
      .catch(function (e) {
        console.log("Error :" + e);
      });
  });
  return repository;
}

async function gitCreateBranch(resolvePathCreateBranch, localBranch) {
  Git.Repository.open(resolvePathCreateBranch).then(function (repo) {
    return repo.getHeadCommit().then(function (commit) {
      return repo.createBranch(localBranch, commit, 0, repo.defaultSignature(), "Created new-branch on HEAD");
    });
  });
  await delay(100);
}

function createSignature(localBranch) {
  return Git.Signature.now("spaship-deployment", localBranch);
}

async function cloneGitRepository(repositoryLink, pathClone) {
  console.log("Cloning Repository " + repositoryLink);
  return Git.Clone(repositoryLink, pathClone).catch(function (err) {
    console.log(err);
    throw new Error("Invalid Repository URL !");
  });
}

function error() {
  res.send(JSON.stringify({ repo: "Error" }));
}
