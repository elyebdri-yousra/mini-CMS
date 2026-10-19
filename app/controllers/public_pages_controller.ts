import type { HttpContext } from '@adonisjs/core/http'
import Page from '#models/page'

export default class PublicPagesController {
  async index({ view }: HttpContext) {
    const pages = await Page.query()
      .where('status', 'published')
      .preload('cover')
      .orderBy('publishedAt', 'desc')
    return view.render('pages/home', { pages, menuPages: await this.menu() })
  }

  async show({ params, view }: HttpContext) {
    // le where('status', 'published') fait aussi office de garde : un brouillon
    // ou un slug inconnu tombent tous les deux dans le firstOrFail -> 404
    const page = await Page.query()
      .where('slug', params.slug)
      .where('status', 'published')
      .preload('cover')
      .firstOrFail()

    return view.render('pages/show', { page, menuPages: await this.menu() })
  }

  // pages affichées dans le menu de navigation du site public
  private menu() {
    return Page.query()
      .where('status', 'published')
      .where('showInMenu', 1) // sqlite stocke les booléens en 0/1
      .orderBy('menuOrder', 'asc')
  }
}
