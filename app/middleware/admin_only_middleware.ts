import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Réserve une route aux comptes admin. À utiliser après le middleware
 * auth (ctx.auth.user doit déjà être défini).
 */
export default class AdminOnlyMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    ctx.response.abortUnless(
      ctx.auth.user?.role === 'admin',
      'Accès réservé aux administrateurs.',
      403
    )
    return next()
  }
}
