import { Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";

import Sidebar from "./components/common/Sidebar";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import StudentDetailPage from "./pages/studentDetailPage";

function App() {
  const [chooseLocation, setChooseLocation] = useState(null);

  console.log("Choose filter data ........ :", chooseLocation);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      <Sidebar />

      {/* Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <ProductsPage
              chooseLocation={chooseLocation}
              setvalue={setChooseLocation}
            />
          }
        />

        {/* Conditionally render additional routes based on chooseLocation */}
        {chooseLocation && (
          <>
            <Route path="/present" element={<UsersPage />} />
            <Route path="/absent" element={<SalesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/student/profile/:id" element={<StudentDetailPage />} />
          </>
        )}

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
