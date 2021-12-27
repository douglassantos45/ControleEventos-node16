import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('ARTICLE_EVENTS', (table) => {
    table.increments('id').notNullable();

    table
      .integer('articleId')
      .notNullable()
      .references('id')
      .inTable('ARTICLES')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table
      .integer('eventId')
      .notNullable()
      .references('id')
      .inTable('EVENTS')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table
      .timestamp('createdAt')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
      .notNullable();
    table
      .timestamp('updatedAt')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
      .notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('ARTICLE_EVENTS');
}
