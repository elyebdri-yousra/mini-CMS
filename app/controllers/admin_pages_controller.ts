import type { HttpContext } from '@adonisjs/core/http'
import Page from '#models/page'
import { pageValidator } from '#validators/page'
import { DateTime } from 'luxon'

export default class AdminPagesController {
  async index({ view }: HttpContext) {
    const pages = await Page.query().orderBy('createdAt', 'desc')
    return view.render('pages/admin/pages/index', { pages })
  }

  async create({ view }: HttpContext) {
    return view.render('pages/admin/pages/create')
  }

  async store({ request, response, auth, session }: HttpContext) {
    const payload = request.only(['title', 'slug', 'excerpt', 'content', 'status', 'menuOrder'])
    if (!payload.slug) delete payload.slug
    const data = await request.validateUsing(pageValidator, { data: payload })

    const page = new Page()
    page.merge({
      ...data,
      showInMenu: request.input('showInMenu') === '1',
      userId: auth.user!.id,
      publishedAt: data.status === 'published' ? DateTime.now() : null,
    })
    await page.save()

    session.flash('success', 'Page créée avec succès.')
    response.redirect().toRoute('admin_pages.index')
  }

  async edit({ params, view }: HttpContext) {
    const page = await Page.findOrFail(params.id)
    return view.render('pages/admin/pages/edit', { page })
  }

  async update({ params, request, response, session }: HttpContext) {
    const page = await Page.findOrFail(params.id)

    const payload = request.only(['title', 'slug', 'excerpt', 'content', 'status', 'menuOrder'])
    if (!payload.slug) delete payload.slug
    const data = await request.validateUsing(pageValidator, {
      data: payload,
      meta: { pageId: page.id },
    })

    const wasPublished = page.status === 'published'
    page.merge({ ...data, showInMenu: request.input('showInMenu') === '1' })

    if (data.status === 'published' && !wasPublished) {
      page.publishedAt = DateTime.now()
    } else if (data.status === 'draft') {
      page.publishedAt = null
    }
    await page.save()

    session.flash('success', 'Page mise à jour avec succès.')
    response.redirect().toRoute('admin_pages.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const page = await Page.findOrFail(params.id)
    await page.delete()

    session.flash('success', 'Page supprimée.')
    response.redirect().toRoute('admin_pages.index')
  }

  // bouton rapide publier / dépublier depuis la liste
  async togglePublish({ params, response, session }: HttpContext) {
    const page = await Page.findOrFail(params.id)
    page.status = page.status === 'published' ? 'draft' : 'published'
    page.publishedAt = page.status === 'published' ? DateTime.now() : null
    await page.save()

    session.flash('success', page.status === 'published' ? 'Page publiée.' : 'Page dépubliée.')
    response.redirect().toRoute('admin_pages.index')
  }
}
