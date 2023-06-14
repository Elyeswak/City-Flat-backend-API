import mongoose from 'mongoose';
import apartmentDb from '../models/appartment.model.js';
import { validationResult } from 'express-validator';
import orderModel from '../models/order.model.js';
import { uploadMultipleImages, updateMultipleImages } from './cloudinary.controller.js';

//add apartment
export function httpAddAppartment(req, res) {
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ error: validationResult(req).array() });
  } else {
    apartmentDb
      .findOne({})
      .or([{ name: req.body.name }])
      .then(async (exists) => {
        if (exists) {
          res.status(409).json({ message: 'Appartment exists already!' });
        } else {
          const newAppartment = req.body;

         console.log(newAppartment);

          if (req.files && req.files.length > 0) {
            const files = req.files.map((file) => file.path);
            try {
              const uploadedImages = await uploadMultipleImages(files);
              newAppartment.img = uploadedImages;
            } catch (error) {
              return res.status(500).json({ error: "error.message 1" });
            }
          }

          apartmentDb
            .create(newAppartment)
            .then((result) => {
              findOneAppartByFilter(result._id)
                .then((register) => res.status(201).json(appartFormat(register)))
                .catch((err) => res.status(500).json({ error: " 2" }));
            })
            .catch((err) => res.status(500).json({ error: "err.3" }));
        }
      })
      .catch((err) => res.status(500).json({ error:" err.message 3" }));
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
///
 export function httpaddServiceToApart(req,res){



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



//delete one appartment with filter
export function httpDeleteOneAppart(req, res) {
   findOneAppartByFilter(req.params.param)
     .then((foundAppart) => {
       if (!foundAppart) {
         res.status(404).json({ error: 'Appartment not found!' });
       } else {
         removeApartmentFromOrders(foundAppart._id)
           .then(() => {
             apartmentDb
               .findByIdAndDelete(foundAppart._id)
               .then((result) => {
                 res.status(200).json({
                   message: `${foundAppart.name} deleted successfully`,
                 });
               })
               .catch((err) => res.status(500).json({ error: err.message }));
           })
           .catch((err) => res.status(500).json({ error: err.message }));
       }
     })
     .catch((err) => res.status(500).json({ error: err.message }));
 }
 
 function removeApartmentFromOrders(appartmentId) {
   return orderModel.updateMany(
     { appartment: appartmentId },
     { $unset: { appartment: 1 } }
   );
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



 export async function updateBookedDates(apartmentId, checkInDate, checkOutDate, res) {
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

    if (overlap) {
      console.log('Overlap detected');
      return res.status(400).json({ error: 'Selected dates overlap with existing bookings' });
    }

    // Add the booked dates to the apartment document
    apartment.bookedDates.push({ start: isoCheckInDate, end: isoCheckOutDate });

    // Remove any booked dates that have already passed
    const today = new Date();
    apartment.bookedDates = apartment.bookedDates.filter(({ end }) => new Date(end) > today);

    // Save the apartment document
    const updatedApartment = await apartment.save();
    console.log('Apartment updated:', updatedApartment);

    // Return a success response
    
  } catch (error) {
    console.error(error);
  
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
 
 
    };
 }