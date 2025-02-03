import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { saveAs } from "file-saver";
import { Toaster, toast } from "react-hot-toast";
import { Oval } from "react-loader-spinner";
import { useParams } from "react-router-dom";
import ImageBackground from "../image/image";

const StudentDetail = () => {
  const { email } = useParams();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState("All"); 

  // Fetch Student Data
  const fetchStudentData = async (email, attendanceStatus) => {
    setLoading(true);
    try {
      const collegeName = localStorage.getItem("collegeName");
      const urls = {
        "Technocrats": "https://x8ki-letl-twmt.n7.xano.io/api:V6Q6GSfP/bhopalstudnetdetail",
        "Mathura": "https://x8ki-letl-twmt.n7.xano.io/api:2aSKmYpj/maturastudentdetail",
      };

      const url = urls[collegeName];
      if (!url) {
        toast.error("Invalid college selection!");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        url,
        { email, check: attendanceStatus }, 
        { headers: { "Content-Type": "application/json" } }
      );

      if(collegeName=='Technocrats'){
        console.log("Fetched Data:", response?.data);
        setUsers(response.data.flat(Infinity) || []);
        setFilteredUsers(response.data.flat(Infinity) || []); // Ensure filteredUsers is updated
              toast.success("Data fetched successfully!", {
                style: { background: "#4caf50", color: "#fff" },
              });
      }
      else if(collegeName=='Mathura'){
        console.log("Fetched Data:", response?.data?.result.flat(Infinity)  );
        setUsers( response?.data?.result.flat(Infinity) || []);
        setFilteredUsers(response.data?.result.flat(Infinity) || []); // Ensure filteredUsers is updated
              toast.success("Data fetched successfully!", {
                style: { background: "#4caf50", color: "#fff" },
              });
      }
 
    } catch (error) {
      toast.error("Failed to fetch data!", {
        style: { background: "#f44336", color: "#fff" },
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when email or attendance status changes
  useEffect(() => {
    if (email) {
      fetchStudentData(email, attendanceStatus);
    }
  }, [email, attendanceStatus]);

  // Download CSV
  const downloadCSV = () => {
    if (filteredUsers.length === 0) {
      toast.error("No data available to download!");
      return;
    }

    const headers = ["CohortName", "Lab", "Attendance", "BL_Engineer", "Date"];
    const rows = filteredUsers.map((user) => [
      user.cohort || "N/A",
      user.Lab || "N/A",
      user.attendance || "N/A",
      user.BL_Engineer || "N/A",
      new Date(user.created_at).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: false,
      }),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    saveAs(
      new Blob([csvContent], { type: "text/csv;charset=utf-8;" }),
      `${users[0]?.name || "Student"}_${users[0]?.created_at || "Data"}.csv`
    );
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {loading ? (
        <div className="flex justify-center items-center py-4">
          <Oval height="50" width="50" color="#4caf50" ariaLabel="loading-indicator" />
        </div>
      ) : filteredUsers.length > 0 ? (
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-100">
              {users[0]?.name || "Student Data"}
            </h2>

            <div className="flex items-center space-x-4">
              <button
                className="bg-gray-700 text-white rounded-lg px-4 py-2"
                onClick={downloadCSV}
              >
                Download CSV
              </button>
              <select
                className="bg-gray-700 text-white rounded-lg px-4 py-2"
                value={attendanceStatus}
                onChange={(e) => setAttendanceStatus(e.target.value)}
              >
                 <option value="All">All</option>
                <option value="absent">Absent</option>
                <option value="present">Present</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  {["Date", "Attendance", "Cohort", "Tech Stack", "BL_Engineer"].map((header) => (
                    <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsers.map((user, index) => (
                  <motion.tr key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                    <td className="px-4 py-4">
                      {new Date(user.date || user.created_at || users.today).toLocaleDateString("en-US", {
                        weekday: "long", 
                        month: "long", 
                        day: "2-digit", 
                        year: "numeric", 
                      })}
                    </td>
                    <td
                      className={`px-4 py-4 h-10 w-10 rounded-full bg-gradient-to-r to-blue-500 flex items-center justify-center font-semibold ${
                        user.attendance === "A" ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      {user.attendance || "N/A"}
                    </td>
                    <td className="px-4 py-4">{user.cohort || "N/A"}</td>
                    <td className="px-4 py-4">{user.Lab || "N/A"}</td>
                    <td className="px-4 py-4">{user.BL_Engineer || "N/A"}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <div className="text-center">
          <ImageBackground />
          <p className="text-gray-300">No data available for {email}</p>
        </div>
      )}
    </>
  );
};

export default StudentDetail;
