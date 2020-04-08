const ms = require("ms");
const axios = require("axios");
const fsp = require("fs").promises;
const path = require("path");
const urljoin = require("url-join");
const { keyBy, mapValues, find } = require("lodash");
const config = require("../config");
const { log } = require("@spaship/common/lib/logging/pino");

/**
 * Automatically syncs remote url targets to local static files in the background at a set interval
 */
class Autosync {
  constructor() {
    this.autosync = config.get("autosync");
    if (this.autosync) {
      this.targets = this.autosync.targets;
    } else {
      this.targets = [];
    }
    this.intervalHandles = [];
  }

  static async getCachedTarget(name) {
    // get named target from config
    const targets = config.get("autosync:targets");
    const target = find(targets, { name });

    if (!target) return {};

    let cachedTargets = {};

    // set up keys based on sub-paths, or default "/" path if no sub-paths are defined
    if (target.source.sub_paths) {
      cachedTargets = keyBy(target.source.sub_paths);
    } else {
      cachedTargets["/"] = "";
    }

    // spin up a readFile for each path (one default path, or multiple subpaths)
    cachedTargets = mapValues(cachedTargets, (p) => fsp.readFile(path.join(target.dest.path, p, target.dest.filename)));

    // await file read and convert to string
    for (let f in cachedTargets) {
      cachedTargets[f] = (await cachedTargets[f]).toString();
    }

    return cachedTargets;
  }

  isRunning() {
    return this.intervalHandles.length > 0;
  }

  start() {
    log.debug("[Autosync] starting..");

    // Start syncing each target on it's interval
    for (let target of this.targets) {
      const handle = setInterval(() => {
        this.syncTarget(target);
      }, parseInt(ms(target.interval)));
      this.intervalHandles.push(handle); // save a reference to the handle in case we want to stop it later
    }
  }

  stop() {
    this.intervalHandles.forEach(clearInterval);
    this.intervalHandles = [];
  }

  /**
   * Force a sync of all targets immediately
   */
  async forceSyncAll() {
    const syncs = this.targets.map((target) => this.syncTarget(target));
    await Promise.all(syncs);
  }

  /**
   * Syncs the remote url target to the destination file
   * @param target
   * @returns {Promise<void>}
   */
  async syncTarget(target) {
    let url = target.source.url;
    let destPath = target.dest.path;
    let file = path.join(destPath, target.dest.filename);

    // If there are sub-paths defined get them
    if (target.source.sub_paths) {
      for (let subPath of target.source.sub_paths) {
        url = urljoin(target.source.url, subPath);
        destPath = path.join(target.dest.path, subPath);
        file = path.join(destPath, target.dest.filename);

        await this._syncSingleURL(url, destPath, file);
      }
    } else {
      await this._syncSingleURL(url, destPath, file);
    }
  }

  async _syncSingleURL(url, path, file) {
    let response;

    try {
      log.info("[Autosync] Getting target url:", url);
      response = await axios.get(url);
    } catch (error) {
      log.error("[Autosync] Error fetching remote target:", url, error);
      return;
    }

    try {
      if (response && response.status === 200) {
        // Make sure dest path exists
        let exists = await this.isDirectory(path);
        if (!exists) {
          log.info("[Autosync] Making dir:", path);
          await fsp.mkdir(path, { recursive: true });
        }

        // Now write destination file
        //TODO: Only write file if it is different that what is currently on disk
        await fsp.writeFile(file, response.data);
        log.info("[Autosync] Successfully wrote dest file:", file);
        return true;
      } else {
        log.error("[Autosync] Invalid response while trying to get url:", url, response.status);
      }
    } catch (error) {
      log.error("[Autosync] Error writing local file:", file, error);
    }
  }

  async isDirectory(path) {
    // the result can be either false (from the caught error) or it can be an fs.stats object
    const result = await fsp.stat(path).catch((err) => {
      if (err.code === "ENOENT") {
        return false;
      }
      throw err;
    });

    return !result ? result : result.isDirectory();
  }
}

module.exports = Autosync;
