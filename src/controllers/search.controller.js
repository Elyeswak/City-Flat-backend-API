import Appartment from '../models/appartment.model.js';
import { APPARTTYPE } from '../models/appartment.enums.js';
import {appartsListFormat,appartFormat} from '../controllers/apartment.controller.js';

//search by name
export async function searchByName(req, res) {
    const name  = req.params.param;
 
    try {
      if (typeof name !== 'string') {
        throw new Error('Name parameter must be a string');
      }
  
      const appartments = await Appartment.find({ name: { $regex: name, $options: 'i' } });
  
      res.status(200).json(appartsListFormat(appartments));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };
//search by price range
export  async  function filterByPriceRange (req, res) {
  const  minPrice= req.body.minPrice;
  const maxPrice = req.body.maxPrice;
  try {
    const filter = {};

    if (minPrice && /^\d+$/.test(minPrice)) {
      filter.pricePerNight = { $gte: parseInt(minPrice) };
    }

    if (maxPrice && /^\d+$/.test(maxPrice)) {
      if (filter.pricePerNight) {
        filter.pricePerNight.$lte = parseInt(maxPrice);
      } else {
        filter.pricePerNight = { $lte: parseInt(maxPrice) };
      }
    }

    const appartments = await Appartment.find(filter);

    res.status(200).json(appartsListFormat(appartments));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
/// filter by  apartment type
export  async function searchByType(req, res)  {
  const type = req.params.param;

  try {
    const appartments = await Appartment.find({ type: APPARTTYPE[type.toUpperCase()] });

    res.status(200).json(appartsListFormat(appartments));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};