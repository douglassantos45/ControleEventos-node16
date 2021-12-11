import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('articles', (table) => {
    table.increments('id').notNullable();
    table.string('title').notNullable();

    table
      .integer('member_id')
      .notNullable()
      .references('id')
      .inTable('members')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table
      .integer('event_id')
      .notNullable()
      .references('id')
      .inTable('events')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('articles');
}
