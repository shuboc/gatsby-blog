import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title="All posts" />
        <Bio />
        <p>No blog posts found.</p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title={siteTitle} url={data.site.siteMetadata?.siteUrl} />
      <Bio />
      <div className="post-card-list">
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug
          const category = post.frontmatter.tags?.[0] || null
          const excerpt = post.frontmatter.description || post.excerpt

          return (
            <Link
              key={post.fields.slug}
              to={post.fields.slug}
              className="post-card"
            >
              <div className="post-card__meta">
                {category && (
                  <span className="post-card__category">{category}</span>
                )}
                <span className="post-card__date">{post.frontmatter.date}</span>
              </div>
              <h2 className="post-card__title">{title}</h2>
              <p className="post-card__excerpt">{excerpt}</p>
              <span className="post-card__read-more">Read more &#8594;</span>
            </Link>
          )
        })}
      </div>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { draft: { ne: true } } }
    ) {
      nodes {
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
`
