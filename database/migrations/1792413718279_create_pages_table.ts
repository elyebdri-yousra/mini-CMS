import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('title').notNullable()
      table.string('slug').notNullable().unique()
      table.text('excerpt').nullable()
      table.text('content').nullable()
      table.string('status', 20).notNullable().defaultTo('draft')
      table.boolean('show_in_menu').notNullable().defaultTo(false)
      table.integer('menu_order').notNullable().defaultTo(0)
      table.timestamp('published_at').nullable()

      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}