import edge from 'edge.js'
import { addCollection, edgeIconify } from 'edge-iconify'
import lucideIcons from '@iconify-json/lucide/icons.json' with { type: 'json' }
import { marked } from 'marked'

edge.use(edgeIconify)
addCollection(lucideIcons)

// convertit le contenu Markdown d'une page en HTML, utilisable en vue avec {{{ markdown(page.content) }}}
edge.global('markdown', (content: string | null) => (content ? marked.parse(content, { async: false }) : ''))
