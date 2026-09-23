import * as React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import avatar from "../images/about-avatar.jpg"

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
      <Link to="/about/" tabIndex={-1} aria-hidden="true">
        <img
          className="bio-avatar"
          src={avatar}
          alt=""
          width={60}
          height={60}
        />
      </Link>
      <div className="bio-text">
        <Link to="/about/" className="bio-name">
          <strong>{author.name}</strong>
        </Link>
        {author.summary && (
          <span className="bio-summary">{author.summary}</span>
        )}
      </div>
    </div>
  )
}

export default Bio
