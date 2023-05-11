import "./App.css";
import React, { useEffect, useState } from "react";
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
import ContactUs from "./components/ContactUs/ContactUs";
import TestPage from "./testpage/testpage";
import ServicesDash from "./components/AdminDashboard/ServicesDash";
import Notifications from "./components/Notifications/Notifications";
import FilteringResults from "./components/Home/FilteringPage/FilteringResults";
import ForgetPassword from "./components/Auth/forget-password/ForgetPassword";
import ResetPassword from "./components/Auth/reset-password/ResetPassword";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18next"; // your i18n instance
import NotFound from "./components/NotFound/NotFound";
function App() {
  const [filteredData, setFilteredData] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem("language") || "en"
  );

  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
  }, [currentLanguage]);

  return (
    <I18nextProvider i18n={i18n}>
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
            <Route path="/help" element={<ContactUs />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route
              path="/results"
              element={<FilteringResults />}
              filteredData={filteredData}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admndash" element={<AdminDash />} />
            <Route path="/ordersdash" element={<OrdersDash />} />
            <Route path="/appartdash" element={<AppartmentDash />} />
            <Route path="/servdash" element={<ServicesDash />} />
            <Route path="/userdash" element={<UsersDash />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </I18nextProvider>
  );
}

export default App;
