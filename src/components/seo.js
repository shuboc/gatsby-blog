/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

import coverImg from '../images/cover.jpg'

const Seo = ({ description, lang, meta, title, image, url, steps, type, datePublished, dateModified, keywords }) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            siteUrl
            description
            author {
              name
            }
            social {
              twitter
              linkedin
            }
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const defaultTitle = site.siteMetadata?.title

  const articleMeta = type === `article` ? [
    {
      property: `article:published_time`,
      content: datePublished,
    },
    {
      property: `article:modified_time`,
      content: dateModified || datePublished,
    },
    ...(keywords || []).map(kw => ({
      property: `article:tag`,
      content: kw,
    })),
  ] : []

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={defaultTitle ? `%s - ${defaultTitle}` : null}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:image`,
          content: image || site.siteMetadata?.siteUrl + coverImg,
        },
        {
          property: `og:type`,
          content: type === `article` ? `article` : `website`,
        },
        {
          property: `og:url`,
          content: url,
        },
        {
          property: 'fb:app_id',
          content: 1994883547264823,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata?.social?.twitter || ``,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ].concat(articleMeta).concat(meta)}
    >
      <link rel="canonical" href={url} />
      {steps && (
        <script type="application/ld+json">
          {
            JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HowTo",
              "name": title,
              "description": description,
              "step": steps.map((step, index) => ({
                "@type": "HowToStep",
                "name": step.name,
                "itemListElement": {
                  "@type": "HowToDirection",
                  "text": step.text
                },
                "position": index + 1
              }))
            })
          }
        </script>
      )}
      {type === `article` && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": title,
            "description": metaDescription,
            "datePublished": datePublished,
            "dateModified": dateModified || datePublished,
            "url": url,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": url,
            },
            "author": {
              "@type": "Person",
              "name": site.siteMetadata.author?.name || `shubo`,
              "url": `${site.siteMetadata.siteUrl.replace(/\/$/, ``)}/about/`,
              ...(site.siteMetadata.social?.linkedin && {
                "sameAs": [site.siteMetadata.social.linkedin],
              }),
            },
            ...(keywords && keywords.length > 0 && { "keywords": keywords }),
          })}
        </script>
      )}
    </Helmet>
  )
}

Seo.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
}

Seo.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf([`article`, `website`]),
  datePublished: PropTypes.string,
  dateModified: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
}

export default Seo
