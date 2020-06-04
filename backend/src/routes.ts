import { Router } from 'express';
import knex from './database/connection';

const routes = Router();

interface ItemData {
  title: string;
  image: string;
  id: number;
}

routes.get('/items', async (req, res) => {
  const items: ItemData[] = await knex('items').select('*');

  const serializedItems = items.map(item => {
    return {
      id: item.id,
      title: item.title,
      image_url: `http://localhost:3333/uploads/${item.image}`,
    }
  })

  return res.json(serializedItems);
});

export default routes;
