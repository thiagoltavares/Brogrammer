import knex from '../database/connection';
import { Request, Response } from "express";

interface ItemData {
  title: string;
  image: string;
  id: number;
}

class ItemsController {
  async index(req: Request, res: Response) {
   
    const items: ItemData[] = await knex('items').select('*');
   
    const serializedItems = items.map(item => {
      return {
        id: item.id,
        title: item.title,
        image_url: `http://localhost:3333/uploads/${item.image}`,
      }
    })

    return res.json(serializedItems);

  }
}

export default ItemsController;