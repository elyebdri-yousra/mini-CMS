import type { HttpContext } from '@adonisjs/core/http'
import Page from '#models/page'
import PageVersion from '#models/page_version'
import * as Diff from 'diff'

export default class AdminPageVersionsController {
  async index({ params, view }: HttpContext) {
    const page = await Page.findOrFail(params.pageId)
    const versions = await PageVersion.query()
      .where('pageId', page.id)
      .preload('user')
      .orderBy('createdAt', 'desc')

    return view.render('pages/admin/pages/versions/index', { page, versions })
  }

  async compare({ params, request, view }: HttpContext) {
    const page = await Page.findOrFail(params.pageId)
    const versions = await PageVersion.query()
      .where('pageId', page.id)
      .preload('user')
      .orderBy('createdAt', 'desc')

    const fromId = request.input('from')
    const toId = request.input('to')

    let diff: { value: string; cls: string }[] | null = null
    let from: PageVersion | null = null
    let to: PageVersion | null = null

    if (fromId && toId) {
      from = await PageVersion.query()
        .where('id', fromId)
        .where('pageId', page.id)
        .preload('user')
        .firstOrFail()
      to = await PageVersion.query()
        .where('id', toId)
        .where('pageId', page.id)
        .preload('user')
        .firstOrFail()
      diff = Diff.diffLines(from.content ?? '', to.content ?? '').map((part) => ({
        value: part.value,
        cls: part.added
          ? 'bg-[color-mix(in_oklab,var(--accent)_18%,transparent)] text-[var(--accent)]'
          : part.removed
            ? 'bg-[color-mix(in_oklab,var(--danger)_18%,transparent)] text-[var(--danger)] line-through'
            : 'text-ink-2',
      }))
    }

    return view.render('pages/admin/pages/versions/compare', {
      page,
      versions,
      from,
      to,
      diff,
      fromId,
      toId,
    })
  }

  async restore({ params, response, session, auth }: HttpContext) {
    const page = await Page.findOrFail(params.pageId)
    const version = await PageVersion.query()
      .where('id', params.versionId)
      .where('pageId', page.id)
      .firstOrFail()

    page.merge({
      title: version.title,
      slug: version.slug,
      excerpt: version.excerpt,
      content: version.content,
      status: version.status,
      showInMenu: version.showInMenu,
      menuOrder: version.menuOrder,
    })
    await page.save()
    await PageVersion.snapshot(page, auth.user!.id)

    session.flash('success', 'Version restaurée avec succès.')
    response.redirect().toRoute('admin_page_versions.index', { pageId: page.id })
  }
}
