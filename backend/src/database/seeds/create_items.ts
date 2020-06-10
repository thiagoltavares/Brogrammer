import Knex from 'knex';

export async function seed(knex: Knex) {
  await knex('items').insert([
    { title: 'Javascript', image: 'javascript.svg' },
    { title: 'Java', image: 'java.svg' },
    { title: 'Php', image: 'php.svg' },
    { title: 'Python', image: 'python.svg' },
    { title: 'Ruby', image: 'ruby.svg' },
    { title: 'Swift', image: 'swift.svg' },
  ]);
}
