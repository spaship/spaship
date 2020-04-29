module.exports = {
  title: "SPAship",
  tagline: "SPAship is an open source platform for deploying, integrating, and managing single-page apps (SPAs).",
  url: "https://spaship.com",
  baseUrl: "/",
  favicon: "img/favicon.ico",
  organizationName: "Red Hat", // Usually your GitHub org/user name.
  projectName: "spaship/spaship", // Usually your repo name.
  themeConfig: {
    navbar: {
      logo: {
        alt: "SPAship Logo",
        src: "img/logo.svg",
        srcDark: "img/logo_dark.svg",
      },
      links: [
        {
          to: "docs/introduction",
          activeBasePath: "docs",
          label: "Docs",
          position: "left",
        },
        { to: "blog", label: "Blog", position: "left" },
        {
          href: "https://github.com/spaship/spaship",
          label: "GitHub",
          position: "left",
        },
        {
          to: "/manager",
          label: "Login",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Introduction",
              to: "docs/introduction",
            },
            {
              label: "Getting Start",
              to: "docs/installation",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Stack Overflow",
              href: "https://stackoverflow.com/questions/tagged/spaship",
            },
            {
              label: "Discord",
              href: "https://discordapp.com/invite/spaship",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/spaship",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/spaship/spaship",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} SPAship, Built with Docusaurus.`,
    },
  },
  stylesheets: [
    "https://fonts.googleapis.com/css2?family=Red+Hat+Text&display=swap",
    "https://fonts.googleapis.com/css2?family=Red+Hat+Text:wght@400;700&display=swap",
  ],
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/spaship/spaship/tree/master/docusaurus/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
