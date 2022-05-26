---
id: test-process
title: QA Process for SPAship
sidebar_label: Quality Assurance
---

# Quality Assurance Process for SPAship

***

## Objective

---
To have a Quality assurance process in place for testing the SPAship Manager and SPAShip Orchestrator

## Need

---
* To have an automation testing framework setup for testing the SPAship Manager and SPAship Operator functionalities. 
* To have a process documentation of manual testing 

## Tools & Technologies Used

---
* IDE- Visual Studio Code
* UI Testing Framework- Cypress 
* Postman - For API Testing
* Gitlab- For maintaining the test code and used as the CI platform
* Newman- CLI version of Postman useful for integrating Postman with Gitlab

## Reporting

---
* For Cypress- We are using mochawesome reports
* For Newman- HTML-extra reporting template(Open Source) is used

## Installation Procedure

1. ## Cypress Tests
UI tests for SPAship using Cypress

## Pre-requisites
NodeJs

## Setup
Initialize the package.json (This step should be executed only when setting up the project for the first time)

* Run npm init

```Go through the series of questions that are asked and package.json will be created  ```

* Install cypress using npm

``` npm install cypress --save-dev ```

* In the package.json, in scripts object:

``` sh
"test:e2e": "cypress run",
"test:e2e:browser": "cypress open 
```

* Setup Environment variables and other authentication related info
``` sh
export CYPRESS_ENV=<envname>
export CYPRESS_USERNAME=<username>
export CYPRESS_PASSWORD=<password>
 ```
## Execute tests:
* For headless:
```sh
npm run test:e2e or
npx cypress run
```
* For headed interactive:
```sh
npm run test:e2e:browser or
npx cypress open
```

## Execute single test:
```sh
npx cypress run --spec=<testfilename.js>
```
## Reports 
* Reporting config needs to be done in cypress.json file
* Click [here](https://docs.cypress.io/guides/tooling/reporters#Installed-via-npm) for more details on reporting

2. ## Postman

* Download Postman from [Postman](https://www.postman.com "Postman")
* Navigate to testing gitlab repo [TestRepo](https://gitlab.cee.redhat.com/spaship/spaship-3.0-qa)
* Download the SPAship_API_Final_Collection.postman_collection.json and import it in Postman 

## Notification of Test Completion
* An email is triggered when the reports are generated containing the links to the url where the report is present
* An excel file is maintained containing the email addresses of the stakeholders to whom report has to be emailed

## Bots in place
A google chatbot has been configured that triggers notification whenever any push is made to the QA repository and upon change in the status of Pipeline configured

## Manual Testing Process
* Developer is supposed to move the issues to on QA in Jira
* Weekly once QA-dev sync up call to let the QA know what all tickets are planned for testing
* After the QA has completed testing, he/she would be moving it to the next stage as per workflow and giving a comment
* QA should be mentioning issues/bugs if found in testing in comments

## Application URLs to be Used by QA
* [SPAship UI](https://spaship.qa.redhat.com)



## Supporting Documents and URLs
* [TestPlan](https://docs.google.com/document/d/1FUED1-6cH6gZLJehQfQx74_6KpUcLA5u6tpjOl8xG5Q/edit "Test Plan Document") 
* [TestCases](https://docs.google.c/om/spreadsheets/d/1RUkeRaOO0PsKfUS0FoKcuRnE4Vv1O-CptZ5SurdUzzk/edit#gid=0 "Test Cases" ) 
* [TestingGitLabRepo](https://gitlab.cee.redhat.com/spaship/spaship-3.0-qa "Gitlab Repo Link")