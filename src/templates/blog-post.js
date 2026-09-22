import * as React from "react"
import { Link, graphql } from "gatsby"
import { kebabCase } from "lodash"
import { Disqus } from 'gatsby-plugin-disqus';

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const authorName = data.site.siteMetadata?.author?.name || ``
  const { previous, next } = data

  // Add IntersectionObserver to titles and highlight the corresponding ones in TOC
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // highlight the corresponding TOC part
            const toRemoveHighlight = document.querySelector('.side-nav a.highlight');
            if (toRemoveHighlight) {
              toRemoveHighlight.classList.remove('highlight')
            }
            const toHighlight = document.querySelector(`.side-nav a[href="#${encodeURIComponent(entry.target.id)}"]`)
            if (toHighlight) {
              toHighlight.classList.add('highlight')
            }
          }
        });
      },
      { rootMargin: '0% 0% -80% 0%' }
    );

    const headingElements = document.querySelectorAll('.blog-post h2, h3, h4, h5, h6');

    headingElements.forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => {
      headingElements.forEach((element) => {
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
        image={post.frontmatter.image && data.site.siteMetadata.siteUrl + post.frontmatter.image?.publicURL}
        url={data.site.siteMetadata?.siteUrl + location.pathname}
        steps={post.frontmatter.steps}
        type="article"
        datePublished={post.frontmatter.dateISO}
        dateModified={post.fields.gitAuthorTime}
        keywords={post.frontmatter.tags}
      />
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header className="post-header">
          <div className="post-header__meta">
            {post.frontmatter.tags?.[0] && (
              <span className="post-header__category">
                {post.frontmatter.tags[0]}
              </span>
            )}
            <span className="post-header__date">{post.frontmatter.date}</span>
          </div>
          <h1 className="post-header__title" itemProp="headline">
            {post.frontmatter.title}
          </h1>
          <p className="post-header__byline">
            {authorName}
            {post.frontmatter.tags?.map((tag) => (
              <React.Fragment key={tag}>
                {" "}·{" "}<Link to={`/tags/${kebabCase(tag)}`}>{tag}</Link>
              </React.Fragment>
            ))}
          </p>
        </header>
        <section
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        />
        <hr />
        <footer>
          <Bio />
        </footer>
      </article>
      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
      <div className="fb-page" data-href="https://www.facebook.com/shubo.code/" data-tabs="" data-width="" data-height="" data-small-header="true" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true"><blockquote cite="https://www.facebook.com/shubo.code/" className="fb-xfbml-parse-ignore"><a href="https://www.facebook.com/shubo.code/">Shubo 的程式開發筆記</a></blockquote></div>
      <Disqus
        config={{
          url: data.site.siteMetadata?.siteUrl + location.pathname,
          identifier: post.id,
          title: post.title,
        }}
      />
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
        siteUrl
        author {
          name
        }
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      tableOfContents
      fields {
        gitAuthorTime
      }
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        dateISO: date
        description
        tags
        image {
          publicURL
        }
        steps {
          name
          text
        }
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
