import React from 'react'

export default {
  logo: <span style={{ fontWeight: 800 }}>MBA Lite</span>,
  project: {
    link: 'https://github.com/danub-io/mbalite',
  },
  docsRepositoryBase: 'https://github.com/danub-io/mbalite/blob/main',
  footer: {
    text: `MBA Lite © ${new Date().getFullYear()}`,
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – MBA Lite'
    }
  },
  primaryHue: 250,
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true
  }
}