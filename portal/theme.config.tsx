import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import LogoutButton from './components/LogoutButton'

const config: DocsThemeConfig = {
  logo: <span style={{ fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.05em' }}>🎓 MBA<span style={{color: '#6366f1'}}>Lite.</span></span>,
  project: {
    link: 'https://github.com/danub-io/mbalite',
  },
  navbar: {
    extra: <LogoutButton />
  },
  docsRepositoryBase: 'https://github.com/danub-io/mbalite/tree/main/portal',
  footer: {
    text: 'MBA Lite © Todos os direitos reservados',
  },
}

export default config
