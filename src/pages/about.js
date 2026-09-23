import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const aboutCopy =
  "資深前端工程師，主要使用 React、TypeScript 開發大型 Web 應用。過去十年曾在新創與跨國產品團隊工作，參與過 B2B 與 B2C 產品開發。最近正在探索 AI 時代的新軟體開發方式。這個部落格主要記錄一些實驗、踩坑的過程與心得。"

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
        <p className="about-hero__summary">{aboutCopy}</p>
      </div>
    </Layout>
  )
}

export default AboutPage
