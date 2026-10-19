import { MediaSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Page from '#models/page'

export default class Media extends MediaSchema {
  @hasMany(() => Page, { foreignKey: 'coverMediaId' })
  declare pages: HasMany<typeof Page>
}
