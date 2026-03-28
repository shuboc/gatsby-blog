import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const AboutPage = ({ location }) => {
  const data = useStaticQuery(graphql`
    query AboutQuery {
      site {
        siteMetadata {
          title
          siteUrl
          author {
            name
            summary
          }
        }
      }
    }
  `)

  const { title, siteUrl, author } = data.site.siteMetadata

  return (
    <Layout location={location} title={title}>
      <Seo title="About" url={siteUrl + "/about/"} />
      <div className="about-hero">
        <div className="about-hero__avatar" aria-hidden="true">
          {author.name.charAt(0).toUpperCase()}
        </div>
        <p className="about-hero__name">{author.name}</p>
        {author.summary && (
          <p className="about-hero__summary">{author.summary}</p>
        )}
      </div>
    </Layout>
  )
}

export default AboutPage
