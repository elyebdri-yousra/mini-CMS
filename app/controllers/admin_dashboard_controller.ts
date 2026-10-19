import type { HttpContext } from '@adonisjs/core/http'
import Page from '#models/page'
import User from '#models/user'

export default class AdminDashboardController {
  async index({ view }: HttpContext) {
    const [publishedCount, draftCount, userCount, recentPages] = await Promise.all([
      Page.query().where('status', 'published').count('* as total').first(),
      Page.query().where('status', 'draft').count('* as total').first(),
      User.query().count('* as total').first(),
      Page.query().preload('user').orderBy('updatedAt', 'desc').limit(5),
    ])

    return view.render('pages/admin/dashboard', {
      publishedCount: publishedCount?.$extras.total ?? 0,
      draftCount: draftCount?.$extras.total ?? 0,
      userCount: userCount?.$extras.total ?? 0,
      recentPages,
    })
  }
}
