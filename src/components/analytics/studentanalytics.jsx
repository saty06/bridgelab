import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import ImageBackground from "../image/image";

const StudentAnalytics = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [showTable, setShowTable] = useState(null);
  const [filterOption, setFilterOption] = useState("weekly");
  console.log(chartData)

  // Helper function to generate a date range excluding Sundays
  const generateDateRange = (start, end) => {
    const dates = [];
    const current = new Date(start);

    while (current <= end) {
      if (current.getDay() !== 0) {
        dates.push({
          date: current.toISOString().split("T")[0],
          day: current.toLocaleDateString("en-US", { weekday: "long" }),
        });
      }
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  // Fetch student data from API
  const fetchStudentData = async () => {
    if (filterOption === "dateRange" && (!startDate || !endDate)) {
      toast.error("Please select both start and end dates.");
      return;
    }

    const dateRange =
      filterOption === "weekly"
        ? generateDateRange(
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            new Date()
          )
        : generateDateRange(startDate, endDate);

    if (startDate && startDate < new Date("2025-01-06")) {
      toast.error("Data is not accessible before 2025-01-06.");
      return;
    }

    if (endDate && endDate > new Date()) {
      toast.error("Future data is not accessible.");
      return;
    }

    if (startDate && endDate && startDate > endDate) {
      toast.error("Start date cannot be later than the end date.");
      return;
    }

    try {
      const results = await Promise.allSettled(
        dateRange.map(async (date) => {
          const response = await axios.post(
            "https://x8ki-letl-twmt.n7.xano.io/api:V6Q6GSfP/getstudentdetail",
            { check: true, date: date.date },
            { headers: { "Content-Type": "application/json" } }
          );
          return response?.data.flat(Infinity).length || 0;
        })
      );

      const processedData = results.map((result, index) => {
        
        if (result.status === "fulfilled") {
          const studentCount = result.value;
          const totalStudents = 239; // Replace with a dynamic value
          return {
            day: dateRange[index].day,
            totalStudents,
            presentStudents: studentCount,
            absentStudents: totalStudents - studentCount,
          };
        }
        return null;
      }).filter(Boolean);

      setChartData(processedData);
      setShowTable(processedData);

      toast.success("Data fetched successfully!");
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data.");
    }
  };

  useEffect(() => {
    if (filterOption === "weekly") {
      fetchStudentData();
    }
  }, [filterOption]);

  const handleDateRangeFetch = () => {
    if (filterOption === "dateRange") {
      fetchStudentData();
    }
  };

  return (
    <>
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Toaster position="top-right" />
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-100">
            Student Attendance
          </h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setFilterOption("weekly")}
              className={`${
                filterOption === "weekly" ? "bg-blue-600" : "bg-gray-700"
              } text-white rounded-lg px-4 py-2`}
            >
              Weekly Data
            </button>
            <button
              onClick={() => setFilterOption("dateRange")}
              className={`${
                filterOption === "dateRange" ? "bg-blue-600" : "bg-gray-700"
              } text-white rounded-lg px-4 py-2`}
            >
              Date Range
            </button>
          </div>
          {filterOption === "dateRange" && (
            <div className="flex space-x-4">
              <ReactDatePicker
                selected={startDate}
                onChange={setStartDate}
                className="bg-gray-700 text-white rounded-lg px-4 py-2"
                dateFormat="yyyy-MM-dd"
                placeholderText="Start Date"
              />
              <ReactDatePicker
                selected={endDate}
                onChange={setEndDate}
                className="bg-gray-700 text-white rounded-lg px-4 py-2"
                dateFormat="yyyy-MM-dd"
                placeholderText="End Date"
              />
              <button
                onClick={handleDateRangeFetch}
                className="bg-gray-500 text-white rounded-lg px-4 py-2"
              >
                Fetch Data
              </button>
            </div>
          )}
        </div>

        {showTable && (
          <table className="table-auto w-full text-left text-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2">Day</th>
                <th className="px-4 py-2">Total Students</th>
                <th className="px-4 py-2">Present</th>
                <th className="px-4 py-2">Absent</th>
              </tr>
            </thead>
            <tbody>
              {showTable.map((data, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">{data.day}</td>
                  <td className="px-4 py-2">{data.totalStudents}</td>
                  <td className="px-4 py-2">{data.presentStudents}</td>
                  <td className="px-4 py-2">{data.absentStudents}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
      {!showTable && (
        <div>
          <ImageBackground />
        </div>
      )}
    </>
  );
};

export default StudentAnalytics;