import type { HttpContext } from '@adonisjs/core/http'
import Page from '#models/page'
import Media from '#models/media'
import User from '#models/user'
import PageVersion from '#models/page_version'
import { pageValidator } from '#validators/page'
import { DateTime } from 'luxon'

export default class AdminPagesController {
  async index({ view, request }: HttpContext) {
    const q = request.input('q', '').trim()
    const status = request.input('status', '')
    const author = request.input('author', '')
    const sort = request.input('sort', 'created_desc')

    const query = Page.query().preload('cover').preload('user')

    if (q) {
      query.whereLike('title', `%${q}%`)
    }
    if (status) {
      query.where('status', status)
    }
    if (author) {
      query.where('userId', author)
    }

    if (sort === 'created_asc') {
      query.orderBy('createdAt', 'asc')
    } else if (sort === 'updated_desc') {
      query.orderBy('updatedAt', 'desc')
    } else {
      query.orderBy('createdAt', 'desc')
    }

    const pages = await query
    const authors = await User.query().orderBy('fullName', 'asc')

    return view.render('pages/admin/pages/index', {
      pages,
      authors,
      filters: { q, status, author, sort },
    })
  }

  async create({ view }: HttpContext) {
    const media = await Media.query().orderBy('createdAt', 'desc')
    return view.render('pages/admin/pages/create', { media })
  }

  async store({ request, response, auth, session }: HttpContext) {
    const payload = request.only(['title', 'slug', 'excerpt', 'content', 'status', 'menuOrder'])
    if (!payload.slug) delete payload.slug
    const data = await request.validateUsing(pageValidator, { data: payload })

    const page = new Page()
    page.merge({
      ...data,
      showInMenu: request.input('showInMenu') === '1',
      coverMediaId: request.input('coverMediaId') || null,
      userId: auth.user!.id,
      publishedAt: data.status === 'published' ? DateTime.now() : null,
    })
    await page.save()
    await PageVersion.snapshot(page, auth.user!.id)

    session.flash('success', 'Page créée avec succès.')
    response.redirect().toRoute('admin_pages.index')
  }

  async edit({ params, view }: HttpContext) {
    const page = await Page.findOrFail(params.id)
    const media = await Media.query().orderBy('createdAt', 'desc')
    return view.render('pages/admin/pages/edit', { page, media })
  }

  async update({ params, request, response, session, auth }: HttpContext) {
    const page = await Page.findOrFail(params.id)

    const payload = request.only(['title', 'slug', 'excerpt', 'content', 'status', 'menuOrder'])
    if (!payload.slug) delete payload.slug
    const data = await request.validateUsing(pageValidator, {
      data: payload,
      meta: { pageId: page.id },
    })

    const wasPublished = page.status === 'published'
    page.merge({
      ...data,
      showInMenu: request.input('showInMenu') === '1',
      coverMediaId: request.input('coverMediaId') || null,
    })

    if (data.status === 'published' && !wasPublished) {
      page.publishedAt = DateTime.now()
    } else if (data.status === 'draft') {
      page.publishedAt = null
    }
    await page.save()
    await PageVersion.snapshot(page, auth.user!.id)

    session.flash('success', 'Page mise à jour avec succès.')
    response.redirect().toRoute('admin_pages.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const page = await Page.findOrFail(params.id)
    // sqlite n'applique pas ON DELETE CASCADE par défaut
    await PageVersion.query().where('pageId', page.id).delete()
    await page.delete()

    session.flash('success', 'Page supprimée.')
    response.redirect().toRoute('admin_pages.index')
  }

  // bouton rapide publier / dépublier depuis la liste
  async togglePublish({ params, response, session, auth }: HttpContext) {
    const page = await Page.findOrFail(params.id)
    page.status = page.status === 'published' ? 'draft' : 'published'
    page.publishedAt = page.status === 'published' ? DateTime.now() : null
    await page.save()
    await PageVersion.snapshot(page, auth.user!.id)

    session.flash('success', page.status === 'published' ? 'Page publiée.' : 'Page dépubliée.')
    response.redirect().toRoute('admin_pages.index')
  }
}
