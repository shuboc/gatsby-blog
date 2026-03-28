import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
        }
      }
    }
  `)

  const author = data.site.siteMetadata?.author
  if (!author?.name) return null

  return (
    <div className="bio">
      <div className="bio-avatar" aria-hidden="true">
        {author.name.charAt(0).toUpperCase()}
      </div>
      <div className="bio-text">
        <strong className="bio-name">{author.name}</strong>
        {author.summary && (
          <span className="bio-summary">{author.summary}</span>
        )}
      </div>
    </div>
  )
}

export default Bio
