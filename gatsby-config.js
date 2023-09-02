module.exports = {
  siteMetadata: {
    title: `Shubo 的程式開發筆記`,
    author: {
      name: `Shubo Chao`,
      summary: `軟體工程師, 喜歡研究前端效能優化等議題`,
    },
    description: `程式設計筆記、教學和讀書心得`,
    siteUrl: `https://shubo.io/`,
    social: {
      twitter: `shubo_tw`,
    },
  },
  plugins: [
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: `gatsby-remark-table-of-contents`,
            options: {
              exclude: "目錄",
              tight: false,
              ordered: false,
              fromHeading: 1,
              toHeading: 6,
              className: "toc"
            },
          },
          `gatsby-remark-autolink-headers`,
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    // {
    //   resolve: `gatsby-plugin-google-analytics`,
    //   options: {
    //     trackingId: `ADD YOUR TRACKING ID HERE`,
    //   },
    // },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.nodes.map(node => {
                return Object.assign({}, node.frontmatter, {
                  description: node.excerpt,
                  date: node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + node.fields.slug,
                  guid: site.siteMetadata.siteUrl + node.fields.slug,
                  custom_elements: [{ "content:encoded": node.html }],
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  nodes {
                    excerpt
                    html
                    fields {
                      slug
                    }
                    frontmatter {
                      title
                      date
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "Gatsby Starter Blog RSS Feed",
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Gatsby Starter Blog`,
        short_name: `GatsbyJS`,
        start_url: `/`,
        background_color: `#ffffff`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        // theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/favicon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-react-helmet`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    {
      resolve: "gatsby-plugin-sitemap",
      options: {
        query: `
          {
            allSitePage {
              nodes {
                path
              }
            }
            allMarkdownRemark {
              nodes {
                fields {
                  slug
                  gitAuthorTime
                }
              }
            }
          }
        `,
        resolveSiteUrl: () => `https://shubo.io/`,
        resolvePages: ({
          allSitePage: { nodes: allPages },
          allMarkdownRemark: { nodes: allMarkdownRemarkNodes },
        }) => {
          const nodeMap = allMarkdownRemarkNodes.reduce((acc, node) => {
            const { fields } = node
            const { slug } = fields
            acc[slug] = fields
            return acc
          }, {})

          return allPages.map(page => {
            return { ...page, ...nodeMap[page.path] }
          })
        },
        serialize: ({ path, gitAuthorTime }) => {
          return {
            url: path,
            lastmod: gitAuthorTime,
          }
        },
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          "UA-67843032-2", // Google Analytics / GA
        ],
      }
    },
    'gatsby-redirect-from',
    'gatsby-plugin-meta-redirect',
    {
      resolve: `gatsby-plugin-gatsby-cloud`,
      options: {
        mergeSecurityHeaders: false, // boolean to turn off the default security headers
      }
    },
    {
      resolve: `gatsby-plugin-disqus`,
      options: {
          shortname: `shuboc`
      }
    },
    'gatsby-plugin-netlify',
  ],
}
