import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/Auth/login/login";
import Signup from "./components/Auth/signup/signup";
import Homepage from "./Pages/Homepage";
import LuxuryPage from "./Pages/LuxuryPage";
import PremiumPage from "./Pages/PremiumPage";
import StandardPage from "./Pages/StandardPage";
import ThankyouPage from "./components/Thankyou/ThankyouPage";
import Wishlist from "./components/Wishlist/Wishlist";
import ConfirmationPage from "./components/Confirmation/ConfirmationPage";
import ApartmentDetails from "./components/ApartmentDetails/ApartmentDetails";
<<<<<<< HEAD
import Paynow from "./components/Payment/Paynow";
import ReservationHistory from "./components/Payment/ReservationHistory";
import Payment from "./components/Payment/Payment";
=======
import RequestsPage from "./components/Requests/RequestsPage";

>>>>>>> 64e37fab1031fd16e62f9c646c99b7678632ac38

function App() {
  return (
    <div className="App">
      <BrowserRouter>
<<<<<<< HEAD
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/luxury" element={<LuxuryPage />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/standard" element={<StandardPage />} />
          <Route path="/thankyou" element={<ThankyouPage />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/paystate" element={<Payment />} />
          <Route path="/paynow" element={<Paynow />} />
          <Route path="/reservationHistory" element={<ReservationHistory />} />
          <Route path="/details/:id" element={<ApartmentDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
=======
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/luxury" element={<LuxuryPage/>}/>
        <Route path="/premium" element={<PremiumPage/>}/>
        <Route path="/standard" element={<StandardPage/>}/>
        <Route path="/thankyou" element={<ThankyouPage/>}/>
        <Route path="/wishlist" element={<Wishlist/>}/>
        <Route path="/confirmation" element={<ConfirmationPage/>}/>
        <Route path="/details/:id" element={<ApartmentDetails/>}/>
        <Route path="/requests" element={<RequestsPage/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
      </Routes>
    </BrowserRouter>
>>>>>>> 64e37fab1031fd16e62f9c646c99b7678632ac38
    </div>
  );
}

export default App;
