import express from 'express';

import{searchByName,
    filterByPriceRange,
    searchByType,
    filterApartments,} from "../controllers/search.controller.js";
import { ensureUser } from '../middlewares/authorization-handler.js';


 /** Defining the router */
 const searchRouter = express.Router();

 searchRouter
 .route('/:param')
 .get(searchByName);

 searchRouter
 .route('/byPrice')
 .post(filterByPriceRange);

 searchRouter
 .route('/type/:param')
 .get(searchByType);

 searchRouter
 .route('/filter')
 .post(filterApartments);


 export { searchRouter };