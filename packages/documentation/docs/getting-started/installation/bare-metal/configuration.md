---
id: configuration
title: Setup SPAship Engine
sidebar_label: Configuration
---

## Configuring SPAship for local development :

If you want to contribute to *SPAship*, here's how to setup a local development environment.  Note, this relies on the **internal SSO** server, so you must be on the VPN.

**Step-by-step guide**
1. Install and start mongodb, on the default port-27017
2. Using git, clone a copy of the repo (if you aren't a member of the SPAship org, fork the repo and clone it)
3. Download the attached .env file and copy it into the project's root directory. please consider having a look at [this doc](https://docs.engineering.redhat.com/pages/viewpage.action?spaceKey=~mclayton&title=Configuring+SPAship+for+local+development+inside+the+VPN)
- The configuration in this file is tailored to SPAship development inside Red Hat, and the configuration will only work if you're on the Red Hat VPN
- Feel free to customize it.  For example, if you need to use a remote mongodb, there are commented-out configuration values you can activate
4. sudo npx spandx init cp addhosts
- This will add some local development hostnames to /etc/hosts
- sudo is optional; if you run it without sudo it will simply print simple instructions rather than adding the entries directly to /etc/hosts
5. npm install
6. npm start
- This will launch the SPAship api, sync, router, and manager.  Alternatively, you can launch them each individually in four separate terminal windows, by cd'ing into packages/{api,sync,router,manager} and running npm start within each

