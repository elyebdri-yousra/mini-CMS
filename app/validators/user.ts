import vine from '@vinejs/vine'

/**
 * Validator to use before validating user credentials
 * during login
 */
export const loginValidator = vine.create({
  email: vine.string().email().maxLength(254),
  password: vine.string(),
})

export const userRoles = ['admin', 'editor'] as const

/**
 * Utilisé par l'admin pour créer un compte (admin ou éditeur).
 */
export const createUserValidator = vine.create({
  fullName: vine.string().trim().minLength(2),
  email: vine.string().email().maxLength(254).unique({ table: 'users', column: 'email' }),
  password: vine.string().minLength(8).maxLength(32),
  role: vine.enum(userRoles),
})

/**
 * Utilisé pour modifier un compte existant. `meta: { userId }` exclut
 * l'utilisateur lui-même de la vérification d'unicité de l'email.
 */
export const updateUserValidator = vine.create({
  fullName: vine.string().trim().minLength(2),
  email: vine
    .string()
    .email()
    .maxLength(254)
    .unique({
      table: 'users',
      column: 'email',
      filter: (query, _value, field) => {
        if (field.meta.userId) {
          query.whereNot('id', field.meta.userId as number)
        }
      },
    }),
  // optionnel : si vide, le mot de passe actuel est conservé
  password: vine.string().minLength(8).maxLength(32).optional(),
  role: vine.enum(userRoles),
})
