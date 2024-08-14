import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

const RecentImages = () => {
  const data = useStaticQuery(graphql`
    query {
      allFile(
        sort: { fields: [relativePath], order: DESC }
        filter: { extension: { regex: "/(jpg|jpeg|png)/" } }
        limit: 3
      ) {
        edges {
          node {
            childImageSharp {
              gatsbyImageData(layout: CONSTRAINED, width: 400)
            }
            relativePath
          }
        }
      }
    }
  `)

  return (
    <div>
      {data.allFile.edges.map(({ node }) => {
        const image = getImage(node.childImageSharp.gatsbyImageData)
        return (
          <GatsbyImage
            key={node.relativePath}
            image={image}
            alt={node.relativePath}
            style={{ marginBottom: "1rem", gap: "30px" }}
          />
        )
      })}
    </div>
  )
}

export default RecentImages
