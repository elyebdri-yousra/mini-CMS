import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'page_versions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('page_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('pages')
        .onDelete('CASCADE')
      table
        .integer('user_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')

      // instantané des champs de la page au moment de l'enregistrement
      table.string('title').notNullable()
      table.string('slug').notNullable()
      table.text('excerpt').nullable()
      table.text('content').nullable()
      table.string('status', 20).notNullable()
      table.boolean('show_in_menu').notNullable()
      table.integer('menu_order').notNullable()

      table.timestamp('created_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}