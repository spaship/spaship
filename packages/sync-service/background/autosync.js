const config = require("../config");
const ms = require("ms");
const axios = require("axios");
const shell = require("shelljs");
const fsp = require("fs").promises;
const path = require("path");
const urljoin = require("url-join");

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

  start() {
    console.log("[Autosync] starting..");

    // Start syncing each target on it's interval
    for (let target of this.targets) {
      const handle = setInterval(() => {
        this.syncTarget(target);
      }, parseInt(ms(target.interval)));
      this.intervalHandles.push(handle); // save a reference to the handle in case we want to stop it later
    }
  }

  /**
   * Force a sync of all targets immediately
   */
  forceSyncAll() {
    for (let target of this.targets) {
      this.syncTarget(target);
    }
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

        this._syncSingleURL(url, destPath, file);
      }
    } else {
      this._syncSingleURL(url, destPath, file);
    }
  }

  async _syncSingleURL(url, path, file) {
    let response;

    try {
      console.log("[Autosync] Getting target url:", url);
      response = await axios.get(url);
    } catch (error) {
      console.error("[Autosync] Error fetching remote target:", url, error);
      return;
    }

    try {
      if (response) {
        // Make sure dest path exists
        let exists = await this.isDirectory(path);
        if (!exists) {
          console.log("[Autosync] Making dir:", path);
          await fsp.mkdir(path, {recursive: true});
        }

        // Now write destination file
        //TODO: Only write file if it is different that what is currently on disk
        await fsp.writeFile(file, response.data);
        console.log("[Autosync] Successfully wrote dest file:", file);
        return true;
      }
    } catch (error) {
      console.error("[Autosync] Error writing local file:", file, error);
    }
  }

  async isDirectory(path) {
    // the result can be either false (from the caught error) or it can be an fs.stats object
    const result = await fsp.stat(path).catch(err => {
      if (err.code === "ENOENT") {
        return false;
      }
      throw err;
    });

    return !result ? result : result.isDirectory();
  }
}

module.exports = Autosync;
