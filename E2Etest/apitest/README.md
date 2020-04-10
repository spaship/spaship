Installation:
The easiest way to install Newman is using NPM. If you have Node.js installed, it is most likely that you have NPM installed as well.

$ npm install -g newman
This installs Newman globally on your system allowing you to run it from anywhere. If you want to install it locally, Just remove the -g flag.

Using Homebrew
Install Newman globally on your system using Homebrew.
$ brew install newman

How To Test:
1. Put the test host and api_key in e2e_test.postman_environment.json
2. run the command:
   $ newman run e2e_api.postman_collection.json -e e2e_test.postman_environment.json --insecure
