import React from "react";
import classnames from "classnames";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

const features = [
  {
    title: <>Bootstrap</>,
    imageUrl: "img/undraw_spaship_bootstrap.svg",
    description: <>Quickly bootstrap new SPAs using SPAship's simple yet effective Command Line Interface.</>,
  },
  {
    title: <>Injection</>,
    imageUrl: "img/undraw_spaship_injection.svg",
    description: <>Easily inject common components into SPAs using SPAship's inbuilt Server Side Injection.</>,
  },
  {
    title: <>Routing & Namespace</>,
    imageUrl: "img/undraw_spaship_namespace.svg",
    description: <>Simple & clean route management for your SPAs without the hassle of manual DNS configuration.</>,
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames("col col--4", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`Deploy, Integrate and Manage Single-Page Apps using ${siteConfig.title}`}
      description="SPAship is an open source platform for deploying, integrating, and managing single-page apps (SPAs)."
    >
      <header className={classnames("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <p className="hero__title">
            {" "}
            develop fast · <strong>deploy faster</strong>
          </p>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames("button button--outline button--secondary button--lg", styles.getStarted)}
              to={useBaseUrl("docs/installation")}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
