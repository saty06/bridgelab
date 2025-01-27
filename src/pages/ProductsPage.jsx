import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { AlertTriangle, Package, TrendingUp } from "lucide-react";
import StudentTable from "../components/products/StudentTable";
import { Oval  } from "react-loader-spinner";

const ProductsPage = ({ chooseLocation, setvalue }) => {
  const [totalPresentStudent, setTotalPresentStudent] = useState(null);
  const [totalAbsentStudent, setTotalAbsentStudent] = useState(null);
  const [totalStudent, setTotalStudent] = useState(null);
  const [filterOption, setFilterOption] = useState(chooseLocation);
  const [loading, setLoading] = useState(false);

  console.log("Filter option selected:", filterOption);

  const fetchTotalPresentStudent = async () => {
    setLoading(true)
    try {
      const apiUrl =
        filterOption === "Mathura"
          ? "https://x8ki-letl-twmt.n7.xano.io/api:2aSKmYpj/studentattendance"
          : "https://x8ki-letl-twmt.n7.xano.io/api:V6Q6GSfP/getstudentdetail";

      const response = await axios.post(
        apiUrl,
        { check: true },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setTotalPresentStudent(response?.data?.length || 0);
    } catch (error) {
      console.error("Error fetching present students:", error);
    }
  };

  const fetchTotalAbsentStudent = async () => {
    try {
      const apiUrl =
        filterOption === "Mathura"
          ? "https://x8ki-letl-twmt.n7.xano.io/api:2aSKmYpj/studentattendance"
          : "https://x8ki-letl-twmt.n7.xano.io/api:V6Q6GSfP/getstudentdetail";

      const response = await axios.post(
        apiUrl,
        { check: false },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setTotalAbsentStudent(response?.data?.length || 0);
    } catch (error) {
      console.error("Error fetching absent students:", error);
    }
  };

  const fetchTotalStudent = async () => {
    try {
      const apiUrl =
        filterOption === "Mathura"
          ? "https://x8ki-letl-twmt.n7.xano.io/api:2aSKmYpj/mathurastudent"
          : "https://x8ki-letl-twmt.n7.xano.io/api:ufB-AVZm/studentdata";

      const response = await axios.get(apiUrl, {
        headers: { "Content-Type": "application/json" },
      });
      setTotalStudent(response?.data?.length || 0);
    } catch (error) {
      console.error("Error fetching total students:", error);
    }
    finally{
      setLoading(false)
    }
  };

  const handleFilterChange = (filter) => {
    localStorage.setItem("collegeName", filter);
    setvalue(filter); // Update the state in the parent component
    setFilterOption(filter); // Update local state
  };

  useEffect(() => {
    if (filterOption) {
      fetchTotalPresentStudent();
      fetchTotalAbsentStudent();
      fetchTotalStudent();
    }
  }, [filterOption]);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      {/* Header */}
      <Header
        title={
          filterOption === "Technocrats"
            ? "CG Technocrat Bhopal Learners Dashboard"
            : filterOption === "Mathura"
            ? "GLA Mathura Learners Dashboard"
            : "Choose COE Location"
        }
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Filter Buttons */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => handleFilterChange("Technocrats")}
              className={`${
                filterOption === "Technocrats" ? "bg-blue-600" : "bg-gray-700"
              } text-white rounded-lg px-4 py-2`}
            >
              Technocrats Bhopal
            </button>
            <button
              onClick={() => handleFilterChange("Mathura")}
              className={`${
                filterOption === "Mathura" ? "bg-blue-600" : "bg-gray-700"
              } text-white rounded-lg px-4 py-2`}
            >
              GLA Mathura
            </button>
          </div>
        </div>

        {/* Statistics Section */}
        {loading && (
        <div className="flex justify-center items-center py-4">
          {/* Replace with your preferred spinner */}
          <Oval 
            height="50"
            width="50"
            color="#4caf50"
            ariaLabel="loading-indicator"
          />
        </div>
      )}
        {filterOption && totalStudent !== null ? (
          <motion.div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <StatCard
              name="Total Present Students"
              icon={Package}
              value={totalPresentStudent || 0}
              color="#6366F1"
            />
            <StatCard
              name="Total Absent Students"
              icon={TrendingUp}
              value={totalAbsentStudent || 0}
              color="#10B981"
            />
            <StatCard
              name="Total Students"
              icon={AlertTriangle}
              value={totalStudent || 0}
              color="#F59E0B"
            />
          </motion.div>
        ) : (
          <p className="text-gray-400">Select a location to view stats</p>
        )}

        {/* Student Table */}
        <StudentTable compushName={filterOption} />
      </main>
    </div>
  );
};

export default ProductsPage;
