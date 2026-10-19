import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Services from "./pages/Services";
import RequestService from "./pages/RequestService";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Electricians from "./pages/Electricians";
import ElectricianProfile from "./pages/ElectricianProfile";
import Products from "./pages/Products";

import ScrollToTop from "./components/ScrollToTop";

import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminRequests from "./admin/AdminRequests";
import AdminElectricians from "./admin/AdminElectricians";
import AdminCustomers from "./admin/AdminCustomers";
import AdminServices from "./admin/AdminServices";
import AdminJobs from "./admin/AdminJobs";
import AdminReviews from "./admin/AdminReviews";
import AdminInventory from "./admin/AdminInventory";
import AdminPayments from "./admin/AdminPayments";
import AdminExpenses from "./admin/AdminExpenses";
import AdminReports from "./admin/AdminReports";
import AdminSettings from "./admin/AdminSettings";
import AdminProducts from "./admin/AdminProducts";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <>
      <ScrollToTop />

      <Routes>

        {/* Public Website */}

        <Route
          path="/"
          element={
            <>
              <Navbar
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
              <Home />
              <Footer />
            </>
          }
        />

        <Route
          path="/services"
          element={
            <>
              <Navbar
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
              <Services />
              <Footer />
            </>
          }
        />

        <Route
          path="/products"
          element={
            <>
              <Navbar
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
              <Products />
              <Footer />
            </>
          }
        />

        <Route
          path="/request-service"
          element={
            <>
              <Navbar
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
              <RequestService />
              <Footer />
            </>
          }
        />

        <Route
          path="/about"
          element={
            <>
              <Navbar
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
              <About />
              <Footer />
            </>
          }
        />

        <Route
          path="/contact"
          element={
            <>
              <Navbar
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
              <Contact />
              <Footer />
            </>
          }
        />

        <Route
          path="/electricians"
          element={
            <>
              <Navbar
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
              <Electricians />
              <Footer />
            </>
          }
        />

        <Route
          path="/electricians/:id"
          element={
            <>
              <Navbar
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
              <ElectricianProfile />
            </>
          }
        />

        {/* Admin */}

        <Route path="/admin" element={<AdminLayout />}>

          <Route
            index
            element={<AdminDashboard />}
          />

          <Route
            path="requests"
            element={<AdminRequests />}
          />

          <Route
            path="electricians"
            element={<AdminElectricians />}
          />

          <Route
            path="customers"
            element={<AdminCustomers />}
          />

          <Route
            path="services"
            element={<AdminServices />}
          />

          <Route
            path="jobs"
            element={<AdminJobs />}
          />

          <Route
            path="reviews"
            element={<AdminReviews />}
          />

          <Route
            path="products"
            element={<AdminProducts />}
          />

          <Route
            path="inventory"
            element={<AdminInventory />}
          />

          <Route
            path="payments"
            element={<AdminPayments />}
          />

          <Route
            path="expenses"
            element={<AdminExpenses />}
          />

          <Route
            path="reports"
            element={<AdminReports />}
          />

          <Route
            path="settings"
            element={<AdminSettings />}
          />

        </Route>

      </Routes>
    </>
  );
}

export default App;