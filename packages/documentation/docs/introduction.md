---
id: introduction
title: Introduction
---

---

## What is SPAship?
# ![image alt text](image_0.png)
SPAship is a platform for **deploying**, **integrating**, and **managing** single-page apps (SPAs).
SPAship is an open source project. It is optimized to deploy and host SPAs in a very efficient and performant way. 

### Confused ... :confused: Let me break it down for you :smiley: 
SPAship as a product abstracts the underlying deployment infrastructure through a management portal (SPAship manager or CLI) and cloud-native deployment engine so that the developers can focus on developing SPAs rather than dealing with deployment/delivery and CI configurations. SPAship focuses on improving the deployment experience for developers by providing an easy to use CLI tool, an interactive user interface for web property management  and with  the ability to be integrated with existing CI based deployment platforms.

In short, SPAship is designed to make it simple for developers to deploy their SPAs on any *Kubernetes* Platform without having to know the details of infrastructure.The application setup and website registration are just a one-time configuration, do it once and then forget. Focus on what you care about the most! The end goal of SPAship is to take out the following pains off developers
* Dealing with Infrastructure
* Dealing with CI
* Long Deployment time
* Fixed number of environments to work with

## What is SPA :pushpin: ?
A single-page application (SPA) is an application that is run client-side in a user’s browser. It is loaded with a single page request and the content of the application is updated via JavaScript.  It is generally comprised of static assets such as JavaScript, CSS, and HTML.

SPAs are all about serving an outstanding UX by trying to imitate a “natural” environment in the browser — no page reloads, no extra wait time. It is just one web page that you visit which then loads all other content using **JavaScript** — which they heavily depend on.

:::info

So the mission of SPAship is delightful Single-Page App Deployment and Hosting.

:::


## Problems SPAship tackle :recycle:
* Deploying web apps are too difficult. It consumes a lot of developer time.
    * Manually uploading zip files through drupal.
    * Creating new OpenShift origins per SPA.
    * Using static hosting like Netstorage.
* Development lifecycle is manual, complex, and inefficient.
    * Running in a real environment (eg, QA, STAGE, PROD)
    * CI/CD
* Claiming URL namespaces at any path requires manual mappings in F5 and Akamai

## Solutions SPAship provides  :computer: :100:
* Efficient deployment of SPAs.
    * Deploy apps across any environment in a matter of seconds.
* Provide Bootstrap, configuration & SPA developer experience.
* Chroming
    * Supports Apache server side includes(SSI).
* Routing & namespace management
* CI/CD, lifecycle & validation
* Easily layered on top of existing sites

## What SPAship isn't ....  :x:
* SPAship is not limited to front-end tech choices. We can use any tech stack for spas development.
* It is not replacement of create-react-app, vue-cli . It doesn't create a react or vue project setup for us.

:::note

SPAship is focused on doing one thing really well: shipping SPAs

:::

