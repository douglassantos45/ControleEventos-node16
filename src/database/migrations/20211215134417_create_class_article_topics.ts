import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('article_topics', (table) => {
    table.increments('id').notNullable();

    table
      .timestamp('created_at')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
      .notNullable();

    table
      .integer('article_id')
      .notNullable()
      .references('id')
      .inTable('articles')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table
      .integer('topic_id')
      .notNullable()
      .references('id')
      .inTable('topics')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('article_topics');
}
