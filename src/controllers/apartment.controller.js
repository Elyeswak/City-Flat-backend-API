import mongoose from 'mongoose';
import apartmentDb from '../models/appartment.model.js';
import { validationResult } from 'express-validator';
import orderModel from '../models/order.model.js';


//add apartment
export function httpAddAppartment(req, res) {
    if (!validationResult(req).isEmpty()) {
        res.status(400).json({ error: validationResult(req).array() });
    } else {
        apartmentDb
            .findOne({})
            .or([
                { name: req.body.name },

            ])
            .then((exists) => {
                if (exists) {
                    res.status(409).json({ message: 'Appartment exists already!' });
                } else {
                    const newAppartment = req.body;

                    // newAppartment.name = newAppartment.name.toLowerCase();

                    if (req.file) {
                     newAppartment.img = '../public/images/' + req.file.filename;
                 }
                    apartmentDb
                        .create(newAppartment)
                        .then((result) => {
                            findOneAppartByFilter(result._id)
                                .then((register) => res.status(201).json(appartFormat(register)))
                                .catch((err) =>
                                    res.status(500).json({ error: err.message })
                                );
                        })
                        .catch((err) => res.status(500).json({ error: err.message }));
                }
            })
            .catch((err) => res.status(500).json({ error: err.message }));
    }
}
//get all appartments
export function httpGetAllApparts(req, res) {
    apartmentDb
       .find().populate("reviews")
       .then((apparts) => {
          res.status(200).json(appartsListFormat(apparts));
       })
       .catch((err) => res.status(500).json({ error: err.message }));
 }

 //get one appartment
 export function httpGetOneAppartment(req, res) {
    findOneAppartByFilter(req.params.param)
       .then((foundAppart) => {
          if (!foundAppart) {
             res.status(404).json({ message: 'Appartment not found!' });
          } else {
             res.status(200).json(appartFormat(foundAppart));
          }
       })
       .catch((err) => res.status(500).json({ error: err.message }));
 }

//Update one appartment with filter
 export function httpUpdateOneAppartment(req, res) {
    if (!validationResult(req).isEmpty()) {
       res.status(400).json({ error: validationResult(req).array() });
    } else {
       const newValues = req.body;
       
 
       findOneAppartByFilter(req.params.param)
          .then((foundAppart) => {
             if (!foundAppart) {
                res.status(404).json({ message: 'Appartment not found!' });
             } else {
                //newValues.isVerified = foundAppart.isVerified;
                //newValues.isBanned = foundAppart.isBanned;
                apartmentDb
                   .findByIdAndUpdate(foundAppart._id, newValues)
                   .then((result) => {
                    apartmentDb
                         .findById(result._id)
                         .then((updated) => {
                            res.status(200).json(appartFormat(updated));
                         })
                         .catch((err) =>
                            res.status(500).json({ error: err.message })
                         );
                   })
                   .catch((err) => res.status(500).json({ error: err.message }));
             }
          })
          .catch((err) => res.status(500).json({ error: err.message }));
    }
 }

//remove
 export async function removeApartmentFromOrders(apartmentId) {
   try {
     const result = await orderModel.updateMany(
       { appartment: apartmentId },
       { $unset: { appartment: 1 } }
     );
     console.log(result);
     return result;
   } catch (err) {
     console.error(err);
     return null;
   }
 }

//delete one appartment with filter
 export function httpDeleteOneAppart(req, res) {
    findOneAppartByFilter(req.params.param)


       .then((foundAppart) => {
          if (!foundAppart) {
             res.status(404).json({ error: 'Appartment not found!' });
          } else {
            removeApartmentFromOrders(foundAppart._id)
            apartmentDb
                .findByIdAndDelete(foundAppart._id)
                .then((result) => {
                   res.status(200).json({
                      message: `${foundAppart.name} deleted successfully`,
                   });
                })
                .catch((err) => res.status(500).json({ error: err.message }));
          }
       })
       .catch((err) => res.status(500).json({ error: err.message }));
 }


 /// get all the available dates for this appartment
 export async function getAvailableDates(apartmentId, startDate, endDate) {
   const apartment = await apartmentDb.findById(apartmentId);
 
   const bookedDates = apartment.bookedDates || [];
   const overlappingDates = bookedDates.filter((bookedDate) => {
     return startDate < bookedDate.end && endDate > bookedDate.start;
   });
 
   const availableDates = [];
 
   // if there are no overlapping dates, add the selected range as available
   if (overlappingDates.length === 0) {
     availableDates.push({ start: startDate, end: endDate });
   } else {
     // if there are overlapping dates, calculate the available dates
     let lastEndDate = startDate;
 
     overlappingDates.forEach((bookedDate) => {
       if (bookedDate.start > lastEndDate) {
         availableDates.push({ start: lastEndDate, end: bookedDate.start });
       }
       lastEndDate = bookedDate.end;
     });
 
     if (lastEndDate < endDate) {
       availableDates.push({ start: lastEndDate, end: endDate });
     }
   }
 
   return availableDates;
 }



 export async function updateBookedDates(apartmentId, checkInDate, checkOutDate,res) {
  try {
    const apartment = await apartmentDb.findById(apartmentId);

    if (!apartment) {
      throw new Error('Apartment not found');
    }

    // Convert check-in and check-out dates to ISO strings
    const isoCheckInDate = String(checkInDate);
    const isoCheckOutDate = String(checkOutDate);

    // Check if the new booked dates overlap with any existing booked dates
    const overlap = apartment.bookedDates.some(({ start, end }) => {
      const existingStart = new Date(start);
      const existingEnd = new Date(end);
      const newStart = new Date(isoCheckInDate);
      const newEnd = new Date(isoCheckOutDate);

      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });

    // If there is overlap, return a conflict response
    if (overlap) {
      return ;
    }

    // Add the booked dates to the apartment document
    apartment.bookedDates.push({ start: isoCheckInDate, end: isoCheckOutDate });

    // Remove any booked dates that have already passed
    const today = new Date();
    apartment.bookedDates = apartment.bookedDates.filter(({ end }) => new Date(end) > today);

    // Save the apartment document
    await apartment.save();
    console.log(apartment);

    // Return a success response
    //return res.status(200).json(apartment);
  } catch (error) {
    console.error(error);
    // Return an error response
    
  }
}

 
export async function findOneAppartByFilter(appartFilter) {
    var appartId = null;
    if (mongoose.Types.ObjectId.isValid(appartFilter)) {
        appartId = appartFilter;
    }
    return await apartmentDb.findOne({
        $or: [
            { _id: appartId },

            { name: appartFilter },
        ],
    }).populate('services').populate('reviews');
}
//appartment object format to get all appartments
export function appartsListFormat(apparts) {
    let foundApparts = [];
    apparts.forEach((appartment) => {
        foundApparts.push(appartFormat(appartment));
    });
    return foundApparts;


 }


 

 //Appartment format
export function appartFormat(appartment) {
    return {
       id: appartment._id,
       name: appartment.name,
       description: appartment.description,
       pricePerNight: appartment.pricePerNight,
       bookedDates:appartment.bookedDates,
       location: appartment.location,
       rooms: appartment.rooms,
       reviews: appartment.reviews,
       services: appartment.services,
       type: appartment.type,
       img: appartment.img,
       rating:appartment.rating,
       numOfRatings : appartment.numOfRatings,
       sumOfRatings : appartment.sumOfRatings,
 
    };
 }