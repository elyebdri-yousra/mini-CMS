import { PageVersionSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Page from '#models/page'
import User from '#models/user'

export default class PageVersion extends PageVersionSchema {
  @belongsTo(() => Page)
  declare page: BelongsTo<typeof Page>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  // prend un instantané de l'état actuel de la page
  static async snapshot(page: Page, userId: number | null) {
    return PageVersion.create({
      pageId: page.id,
      userId,
      title: page.title,
      slug: page.slug,
      excerpt: page.excerpt,
      content: page.content,
      status: page.status,
      showInMenu: page.showInMenu,
      menuOrder: page.menuOrder,
    })
  }
}
