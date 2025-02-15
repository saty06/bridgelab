import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import './style.css'

import axios from "axios";
import ImageBackground from "../image/image";
import { saveAs } from "file-saver";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Toaster, toast } from "react-hot-toast";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

const StudentAbasentTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [finalDate, setFinalDate] = useState();
  const [loading, setLoading] = useState(false);
   const navigate = useNavigate();
  
  const StudentDetail=(value)=>{
    navigate(`/student/${value}`)


  }
  

  // Fetch attendance data
  const fetchStudentData = async () => {
    setLoading(true);
    let formattedDate;
    if (selectedDate) {
      const date = new Date(selectedDate); // Your input date

      // Extract day, month, and year
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const year = date.getFullYear();

      // Format the date
      formattedDate = `${month}/${day}/${year}`;
      console.log(formattedDate);
      setFinalDate(formattedDate); // Outputs: "17/01/2025"
    }
    const dayOfWeek = selectedDate.getDay();
    if (
      selectedDate > new Date() ||
      selectedDate < new Date("2025-01-06") ||
      dayOfWeek === 0
    ) {
      toast.error("Data cannot be accessed on Sundays or future data! ", {
        style: {
          background: "#f44336",
          color: "#fff",
        },
        icon: "❌",
      });
      return;
    }
    try {
      if (localStorage.getItem("collegeName") === "Technocrats") {
        const response = await axios.post(
          "https://x8ki-letl-twmt.n7.xano.io/api:V6Q6GSfP/getstudentdetail",
          { check: false, date: formattedDate },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log("Attendance response data:", response?.data);
        setUsers(response?.data.flat(Infinity));

        setFilteredUsers(response?.data.flat(Infinity));
        toast.success("Data fetched successfully!", {
          style: {
            background: "#4caf50",
            color: "#fff",
          },
          icon: "✅",
        });
      } else if (localStorage.getItem("collegeName") === "Mathura") {
        const response = await axios.post(
          "https://x8ki-letl-twmt.n7.xano.io/api:2aSKmYpj/studentattendance",
          { check: false, date: formattedDate },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        console.log("Attendance  Mathura ", response?.data);
        setUsers(response?.data.flat(Infinity) || []);

        setFilteredUsers(response?.data.flat(Infinity));
        toast.success("Data fetched successfully!", {
          style: {
            background: "#4caf50",
            color: "#fff",
          },
          icon: "✅",
        });
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast.error("Failed to fetch data from server!", {
        style: {
          background: "#f44336",
          color: "#fff",
        },
        icon: "❌",
      });
    }
    finally{
      setLoading(false)
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = users.filter(
      (user) =>
        user.Name.toLowerCase().includes(term) ||
        user.Email_Id.toLowerCase().includes(term) ||
        user.Cohort.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };
  const downloadCSV = () => {
    if (filteredUsers.length === 0) {
      alert("No data available to download!");
      return;
    }

    const headers = ["Name", "Email", "Attendance", "Cohort", "BL_Engineer"];
    const rows = filteredUsers.map((user) => [
      user.Name,
      user.Email_Id,
      "A", // Absent
      user.Cohort,
      user.BL_Engineer,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "absent_students.csv");
  };

  useEffect(() => {
    fetchStudentData();
  }, [selectedDate]); // Added an empty dependency array to prevent infinite loop

  return (
    <>
      {users !== null && users.length > 0 && (
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Toaster position="top-right" reverseOrder={false} />
          {loading && (
  <div className="flex justify-center items-center py-4">
    <Oval
      height={50}
      width={50}
      color="#4caf50"
      ariaLabel="loading"
      secondaryColor="#c0e57b"
      strokeWidth={2}
      strokeWidthSecondary={2}
    />
  </div>
)}

          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold text-gray-100">
              Total Students Absent on{" "}
              {new Date(selectedDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </h2>
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
              {users.length}
            </div>
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search users..."
                className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={handleSearch}
              />
              <button
                className="bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={downloadCSV}
              >
                Download CSV
              </button>
              <ReactDatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                className="bg-gray-700 text-white rounded-lg px-4 py-2"
                dateFormat="yyyy-MM-dd"
              />
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Attendance   
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                       Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Cohort
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Tech Stack
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  BL_Engineer
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                         <button key={user.Email_Id}  onClick={()=> StudentDetail(user.Email_Id)}   >
                         {user.Name.charAt(0)}
                         </button>
                          
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-100">
                            {user.Name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {user.Email_Id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">
                        A
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-300">
                       {finalDate}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-300">
                         {user.Cohort}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-300">  {user.Lab ||"Null"}  </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-300">  {user.BL_Engineer} </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
      {(users == null || users.length <= 0) && (
        <div>
          <Toaster position="top-right" reverseOrder={false} />
          <div className="flex justify-center mt-6">
            <ReactDatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              className="bg-gray-700 text-white rounded-lg px-4 py-2"
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <ImageBackground />
        </div>
      )}
    </>
  );
};

export default StudentAbasentTable;
