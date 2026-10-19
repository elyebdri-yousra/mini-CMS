import vine from '@vinejs/vine'

// slug en minuscules, mots séparés par des tirets (ex: "mon-article")
const kebabCase = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const pageStatuses = ['draft', 'published'] as const

/**
 * Utilisé pour la création et l'édition d'une page.
 * On passe `meta: { pageId }` en édition pour exclure la page
 * elle-même de la vérification d'unicité du slug.
 */
export const pageValidator = vine.create({
  title: vine.string().trim().minLength(3),
  // optionnel : si vide, Page#generateSlug le génère depuis le titre
  slug: vine
    .string()
    .trim()
    .toLowerCase()
    .regex(kebabCase)
    .unique({
      table: 'pages',
      column: 'slug',
      filter: (query, _value, field) => {
        if (field.meta.pageId) {
          query.whereNot('id', field.meta.pageId as number)
        }
      },
    })
    .optional(),
  excerpt: vine.string().trim().optional(),
  content: vine.string().trim().optional(),
  status: vine.enum(pageStatuses),
  menuOrder: vine.number().optional(),
})
