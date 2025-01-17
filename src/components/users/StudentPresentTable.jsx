import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import axios from "axios";
import ImageBackground from "../image/image";
import {saveAs} from 'file-saver'
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



const StudentPresentTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch attendance data
  const fetchStudentData = async () => {
let formattedDate= null ;
  if(selectedDate){
    const date = new Date(selectedDate); // Your input date

// Extract day, month, and year
const day = String(date.getDate()).padStart(2, "0");
const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
const year = date.getFullYear();

// Format the date
 formattedDate = `${month}/${day}/${year}`;
console.log(formattedDate); // Outputs: "17/01/2025"
  }

    try {
      const response = await axios.post(
        "https://x8ki-letl-twmt.n7.xano.io/api:V6Q6GSfP/getstudentdetail",
        { check: true ,date:formattedDate },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Attendance response data:", response?.data);
      setUsers(response?.data.flat(Infinity) || []);
     
 setFilteredUsers(response?.data.flat(Infinity))

    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };
  const downloadCSV = () => {
    if (filteredUsers.length === 0) {
      alert("No data available to download!");
      return;
    }

    const headers = ["Name", "Email", "Attendance", "Date"];
    const rows = filteredUsers.map((user) => [
      user.name,
      user.email,
      "P", // Absent
      new Date(user.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour12: false})
     
    ]);

    const csvContent =
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "present_students.csv");
  };

  useEffect(() => {
    fetchStudentData();
  },[selectedDate]); // Added an empty dependency array to prevent infinite loop
 
console.log(" time to  take data  ", selectedDate)

  return (

    <>
  {
    users.length>0 && (
      <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Present Student {users.length} </h2>
        <h4 className="text-xl font-semibold text-gray-100">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric"})} </h4>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <button
                className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={downloadCSV}
                style={{marginLeft:"30px"}}
              >
                Download CSV
              </button>
              <ReactDatePicker
                            
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            className="bg-gray-700 text-white rounded-lg px-4 py-2 mx-6"
                            dateFormat="yyyy-MM-dd"
                          />
        </div>
      </div>
    
      <div className="overflow-x-auto">
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
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-100">{user.name}</div>
                    </div>
                  </div>
                </td>
    
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{user.email}</div>
                </td>
    
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">
                    {user.attendance || "N/A"}
                  </span>
                </td>
    
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-300">
                     { new Date(user.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour12: false})} 
                    
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
    )
  }
  {
    users.length<=0 && (

<ImageBackground></ImageBackground>

    )
  }
 

 
   
    </>
  );
};

export default StudentPresentTable;
