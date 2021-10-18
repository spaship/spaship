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
  const pathClone = path.resolve(__dirname, `./../../${basePath}/${directoryName}`);
  
  const resolvePathCreateBranch = `../../${basePath}/${directoryName}/.git`;
  const pathFile = `${basePath}/${directoryName}/`;
  const localBranch = `${req.body.webPropertyName}_spaship_${uuid()}`;
  const gitToken = req.body.repositoryConfigs[0].gitToken;
  let signature = createSignature(localBranch);

  console.log(`Directory name : ${directoryName}`);
  console.log(`Path Clone : ${pathClone}`);
  console.log(`Eesolve Path Create Branch : ${resolvePathCreateBranch}`);
  console.log(`Path File : ${pathFile}`);
  console.log(`Local Branch : ${localBranch}`);
  console.log(`Resolved Path : `, path.resolve(__dirname, `./../../../${basePath}/${directoryName}.zip`));
  console.log(`System Dir Name : ${__dirname}`);

  await cloneGitRepository(req.body.repositoryConfigs[0].repositoryLink, pathClone);
  await checkoutRemoteBranch(req.body.repositoryConfigs[0].branch, resolvePathCreateBranch);
  await gitCreateBranch(resolvePathCreateBranch, localBranch);
  repository = await gitCheckout(repository, resolvePathCreateBranch, localBranch);
  await createSPAshipTemplateRequest(req, pathFile);
  await gitOperationsCommit(repository, signature, resolvePathCreateBranch, localBranch, gitToken);
  await zipFiles(directoryName);
  const webPropertyResponse = await saveWebProperty(req, res);
  res.send({
    actionStatus: "Git Actions Performed Successfully",
    path: path.resolve(__dirname, `./../../../${basePath}/${directoryName}.zip`),
    webPropertyResponse: webPropertyResponse,
  });
};

async function zipFiles(directoryName) {
  await zip(
    path.resolve(__dirname, `./../../../${basePath}/${directoryName}`),
    path.resolve(__dirname, `./../../../${basePath}/${directoryName}.zip`)
  );
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
      name: spa.spaName,
      mapping: spa.contextPath,
      excludeFromEnvs: spa.envs,
    };
    console.log(spaShipFile);
    fs.writeFileSync(`${pathFile}${spa.spaName}/.spaship`, JSON.stringify(spaShipFile, null, "\t"));
    console.log(`./spaship added at ${pathFile}${spa.spaName}`);
  }
}

async function gitOperationsCommit(repository, signature, resolvePathCreateBranch, localBranch, gitToken) {
  let index;
  let oid;

  Git.Repository.open(path.resolve(__dirname, resolvePathCreateBranch))
    .then(function (repo) {
      repository = repo;
      repo
        .getBranch("refs/heads/" + localBranch)
        .then(function (reference) {
          return repo.checkoutRef(reference);
        })
        .catch(function (e) {
          console.log("Error :" + e);
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
      console.log("4: Add Index By Path " + path.resolve(__dirname, `../../../${basePath}/tempWebpackDevelop/`));
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
      console.log("7 : Oid Result " + oidResult);
      oid = oidResult;
      return Git.Reference.nameToId(repository, "HEAD");
    })
    .then(function (head) {
      console.log("8 : Head Commit Hash " + head);
      return repository.getCommit(head);
    })
    .then(function (parent) {
      console.log("9 : Parent Commit Hash " + parent);
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
    });
  return repository;
}

async function gitCheckout(repository, resolvePathCreateBranch, localBranch) {
  Git.Repository.open(path.resolve(__dirname, resolvePathCreateBranch)).then(function (repo) {
    repository = repo;
    repo
      .getBranch("refs/heads/" + localBranch)
      .then(function (reference) {
        console.log("1: Checking out branch " + localBranch);
        console.log(reference);
        return repo.checkoutRef(reference);
      })
      .catch(function (e) {
        console.log("Error 1:" + e);
      });
  });
  return repository;
}

async function gitCreateBranch(resolvePathCreateBranch, localBranch) {
  Git.Repository.open(path.resolve(__dirname, resolvePathCreateBranch)).then(function (repo) {
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
  });
}

function error() {
  res.send(JSON.stringify({ repo: "Error" }));
}