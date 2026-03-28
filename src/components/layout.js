import * as React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

const Layout = ({ location, children }) => {
  const data = useStaticQuery(graphql`
    query LayoutQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  return (
    <div data-is-root-path={isRootPath}>
      <nav className="site-nav">
        <Link to="/" className="site-nav__logo">{siteTitle}</Link>
        <div className="site-nav__links">
          {isRootPath ? (
            <Link to="/about" className="site-nav__link">About</Link>
          ) : (
            <>
              <Link to="/" className="site-nav__link">&#8592; All posts</Link>
              <Link to="/about" className="site-nav__link">About</Link>
            </>
          )}
        </div>
      </nav>
      <main className="global-wrapper">
        {children}
      </main>
      <footer className="site-footer">
        &#169; {new Date().getFullYear()} shubo
      </footer>
    </div>
  )
}

export default Layout
