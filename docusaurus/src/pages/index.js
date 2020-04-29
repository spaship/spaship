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
    description: <>SPAship could help you bootstrap a SPA very fast</>,
  },
  {
    title: <>Injection</>,
    imageUrl: "img/undraw_spaship_injection.svg",
    description: (
      <>SPAship provide Server Side Injection. Inject your site's head/header/footer into the SPA is more easy to do</>
    ),
  },
  {
    title: <>Routing & Namespace</>,
    imageUrl: "img/undraw_spaship_namespace.svg",
    description: <>You won't need ask anyone for help to setup a DNS/F5 rule or other stuff to make your SPA live</>,
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
    <Layout title={`Hello from ${siteConfig.title}`} description="Description will go into a meta tag in <head />">
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
