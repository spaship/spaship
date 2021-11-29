---
id: test-process
title: QA Process for SPAship
---

# Quality Assurance Process for SPAship

***

## Objective

---
To have a Quality assurance process in place for testing the SPAship Manager and SPAShip Orchestrator

## Need

---
To have an automation testing framework setup for testing the SPAship Manager and SPAship Operator functionalities

## Tools & Technologies Used

---
* IDE- Pycharm
* UI Testing Framework- LCC i.e lemoncheesecake with selenium
* Postman - For API Testing
* Gitlab- For maintaining the test code and used as the CI platform
* Newman- CLI version of Postman useful for integrating Postman with Gitlab

## Reporting

---
* For LCC- reports are a feature of the framework
* For Newman- HTML-extra reporting template(Open Source) is used

## Installation Procedure

1. ## LCC-lemoncheesecake

## Pre-requisites
python3

## Setup
Install and create virtualenv (This step should be executed only when setting up the project for the first time)

* Install virtualenv

``` python3 -m pip install --user virtualenv ```

* Create virtualenv

``` python3 -m venv env ```

* Activate the virtual environment:

``` $ source env/bin/activate ```

* Install dependencies for setting up tests:

``` $ pip install -r requirements.txt ```

* Set Python Path to the current directory:

``` export PYTHONPATH = "<path to your current directory>" ```

* To Check if PYTHONPATH is set correctly to the current directory:

``` echo $PYTHONPATH ```

PYTHONPATH should not be blank and should be your current directory.

## Execute tests:
* Make the changes in the config file for actual values.

``` cp config.ini.sample config.ini ```

Make the appropriate changes to base URL,username and password fields in config.ini file.
You can reach out to any of the contributors for the actual values to be used.
By default, the tests will run in headless mode. If you choose to run otherwise, change the value to "no".

* To run the test against QA env, set the environment variable appropriately.
```export ENV=qa``` Acceptable values for ENV variable are dev/qa/stage.

* To execute the tests:
``` lcc run ```

* To view the reports on console after you ran the tests:
``` lcc report ```

* To view the report in browser:
``` firefox report/report.html ```

* User can choose to run the tests for different environments listed in config.ini file by passing the 'env' and 'base_url'
parameter in 'base.config_reader(`<env>`, `<base_url>`)' method present inside browser_util.py file

* To run a single test:
``` lcc run <test_file_name> ```
e.g. lcc run login_test

Deactivate virtualenv:
``` $ deactivate ```

2. ## Postman

* Download Postman from [Postman](https://www.postman.com "Postman")
* Navigate to testing gitlab repo [TestRepo](https://gitlab.cee.redhat.com/spaship/spaship-3.0-qa)
* Download the spaship_api_test.json and import it in Postman 

## Notification of Test Completion
* An email is triggered when the reports are generated containing the links to the url where the report is present
* An excel file is maintained containing the email addresses of the stakeholders to whom report has to be emailed

## Bots in place
A google chatbot has been configured that triggers notification whenever any push is made to the QA repository and upon change in the status of Pipeline configured

## Application URLs to be Used by QA
* [SPAship Operator](http://qa.operator.apps.grey.dev.iad2.dc.paas.redhat.com)
* [SPAship Backend](http://qa.api.apps.grey.dev.iad2.dc.paas.redhat.com)
* [SPAship UI](http://qa.manager.apps.grey.dev.iad2.dc.paas.redhat.com/)


## Supporting Documents and URLs
* [TestPlan](https://docs.google.com/document/d/1FUED1-6cH6gZLJehQfQx74_6KpUcLA5u6tpjOl8xG5Q/edit "Test Plan Document") 
* [TestCases](https://docs.google.c/om/spreadsheets/d/1RUkeRaOO0PsKfUS0FoKcuRnE4Vv1O-CptZ5SurdUzzk/edit#gid=0 "Test Cases" ) 
* [TestingGitLabRepo](https://gitlab.cee.redhat.com/spaship/spaship-3.0-qa "Gitlab Repo Link")