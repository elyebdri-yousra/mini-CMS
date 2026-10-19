import { PageSchema } from '#database/schema'
import { belongsTo, beforeSave } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Media from '#models/media'

export default class Page extends PageSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Media, { foreignKey: 'coverMediaId' })
  declare cover: BelongsTo<typeof Media>

  // si le slug n'est pas renseigné, on le génère depuis le titre
  @beforeSave()
  static async generateSlug(page: Page) {
    if (!page.slug && page.title) {
      page.slug = page.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '') // enlève les accents
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
  }
}
