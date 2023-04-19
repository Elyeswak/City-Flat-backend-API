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
import Paynow from "./components/Payment/Paynow";
import AccountPage from "./components/Account/AccountPage";
import Payment from "./components/Payment/Payment";
import RequestsPage from "./components/Requests/RequestsPage";
import AdminDash from "./components/AdminDashboard/AdminDash";
import OrdersDash from "./components/AdminDashboard/OrdersDash";
import AppartmentDash from "./components/AdminDashboard/AppartmentDash";
import UsersDash from "./components/AdminDashboard/UsersDash";
import ContactUs from "./components/ContactUs/ContactUs"
import TestPage from './testpage/testpage'
import Notifications from "./components/Notifications/Notifications";
import FilteringResults from "./components/Home/FilteringPage/FilteringResults";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
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
          <Route path="/details/:id" element={<ApartmentDetails />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/help" element={<ContactUs/>} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/notifications" element={<Notifications/>} />
          <Route path="/results" element={<FilteringResults/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admndash" element={<AdminDash />} />
          <Route path="/ordersdash" element={<OrdersDash />} />
          <Route path="/appartdash" element={<AppartmentDash />} />
          <Route path="/userdash" element={<UsersDash />} />
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
