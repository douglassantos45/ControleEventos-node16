import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('institutions', (table) => {
    table.increments('id').notNullable();
    table.string('name').notNullable();
    table.string('city').notNullable();
    table.string('country').notNullable();

    table
      .integer('member_id')
      .notNullable()
      .references('id')
      .inTable('actors')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table
      .timestamp('created_at')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
      .notNullable();
    table
      .timestamp('updated_at')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
      .notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('institutions');
}
