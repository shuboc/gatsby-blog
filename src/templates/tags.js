import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const Tags = ({ pageContext, data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const { tag } = pageContext
  const { edges, totalCount } = data.allMarkdownRemark
  const tagHeader = `${totalCount} 篇有 "${tag}" 標籤的文章`
  const description = edges.map(({ node }) => node.frontmatter.title).join(', ')

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        title={tagHeader}
        description={description}
        url={data.site.siteMetadata?.siteUrl + location.pathname}
      />
      <h1>{tagHeader}</h1>
      <div className="post-card-list">
        {edges.map(({ node }) => {
          const { slug } = node.fields
          const title = node.frontmatter.title
          const category = node.frontmatter.tags?.[0] || null
          const excerpt = node.frontmatter.description || node.excerpt

          return (
            <Link key={slug} to={slug} className="post-card">
              <div className="post-card__meta">
                {category && (
                  <span className="post-card__category">{category}</span>
                )}
                <span className="post-card__date">{node.frontmatter.date}</span>
              </div>
              <h2 className="post-card__title">{title}</h2>
              <p className="post-card__excerpt">{excerpt}</p>
              <span className="post-card__read-more">Read more &#8594;</span>
            </Link>
          )
        })}
      </div>
      <Link to="/tags">所有標籤</Link>
    </Layout>
  )
}

export default Tags

export const pageQuery = graphql`
  query($tag: String) {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMM DD, YYYY")
            title
            description
            tags
          }
        }
      }
    }
  }
`
