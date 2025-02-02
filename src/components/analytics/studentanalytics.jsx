import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import ImageBackground from "../image/image";
import { Oval } from "react-loader-spinner";

const StudentAnalytics = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [showTable, setShowTable] = useState(null);
  const [filterOption, setFilterOption] = useState("weekly");
  const [loading, setLoading] = useState(false);
  const[totalStudent, setTotalStudent] = useState(null)
  console.log(chartData)

  // Helper function to generate a date range excluding Sundays
  const generateDateRange = (start, end) => {
    const dates = [];
    const current = new Date(start);
  
    while (current <= end) {
      if (current.getDay() !== 0) { // Exclude Sundays
        const day = String(current.getDate()).padStart(2, "0");
        const month = String(current.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
        const year = current.getFullYear();
  
        // Format the date as MM/DD/YYYY
        const formattedDate = `${month}/${day}/${year}`;
        dates.push(formattedDate);
      }
      // Increment the date
      current.setDate(current.getDate() + 1);
    }
  
    return dates;
  };
  

  // Fetch student data from API
  const fetchStudentData = async () => {
   

     if(localStorage.getItem("collegeName") === "Technocrats"){
      setLoading(true)

      if (filterOption === "dateRange" && (!startDate || !endDate)) {
        toast.error("Please select both start and end dates.");
        setLoading(false)
        return;
      }
      

     
   

    const dateRange =
      filterOption === "weekly"
        ? generateDateRange(
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            new Date()
          )
        : generateDateRange(startDate, endDate);


    if (filterOption === "dateRange" && startDate < new Date("2025-01-06")) {
      toast.error("Data is not accessible before 2025-01-06.");
      setLoading(false)
      return;
    }

    if (filterOption === "dateRange" && endDate > new Date()) {
      toast.error("Future data is not accessible.");
      setLoading(false)
      return;
    }

    if (startDate && endDate && startDate > endDate) {
      toast.error("Start date cannot be later than the end date.");
      setLoading(false)
      return;
    }
 console.log(" data range range  ", dateRange)



    try {
      const apiUrl ="https://x8ki-letl-twmt.n7.xano.io/api:V6Q6GSfP/bhopalstudentbulkdata";
      const bhopalstudenttotalapi = 'https://x8ki-letl-twmt.n7.xano.io/api:V6Q6GSfP/totalbhopalstudent';
        

      const response = await axios.post(
        apiUrl,
        { date: dateRange },
        { headers: { "Content-Type": "application/json" } }
      );

 const totalstudentResponce = await axios.get(
  bhopalstudenttotalapi, { headers: { "Content-Type": "application/json" } }


 )

 setTotalStudent(totalstudentResponce?.data || null);
 console.log(" total student....... ", totalStudent)

 console.log(" response data.............. ", response)
 if(totalStudent!= null){
  const processedData = response.data.map((result, index) => {
    const studentCount = result || 0; // Adjust based on API response structure
    const totalStudents = totalStudent ; // Replace with a dynamic value if needed
    return {
      day: dateRange[index] || "Unknown Day",
      totalStudents,
      presentStudents: studentCount,
      absentStudents: totalStudents - studentCount,
    };
  });
console.log(response)
  setChartData(processedData);
  setShowTable(processedData);

 }
     
    } catch (error) {
      console.error("Error fetching or processing student data:", error);
    }
    
    finally{
      setLoading(false)
    }
  }
  if(localStorage.getItem("collegeName") === "Mathura"){
    setLoading(true)

    if (filterOption === "dateRange" && (!startDate || !endDate)) {
      toast.error("Please select both start and end dates.");
    setLoading(false)

      return;
    }
    

   
 

  const dateRange =
    filterOption === "weekly"
      ? generateDateRange(
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          new Date()
        )
      : generateDateRange(startDate, endDate);


  if (filterOption === "dateRange" && startDate < new Date("2025-01-21")) {
    toast.error("Data is not accessible before 2025-01-21.");
    setLoading(false)

    return;
  }

  if (filterOption === "dateRange" && endDate > new Date()) {
    toast.error("Future data is not accessible.");
    setLoading(false)

    return;
  }

  if (startDate && endDate && startDate > endDate) {
    toast.error("Start date cannot be later than the end date.");
    setLoading(false)

    return;
  }
console.log(" data range range  ", dateRange)

  try {
    const apiUrl ="https://x8ki-letl-twmt.n7.xano.io/api:2aSKmYpj/mathurabulkstudent";
    const mathurastudenttotalapi = 'https://x8ki-letl-twmt.n7.xano.io/api:2aSKmYpj/totalmathurastudent';
      

    const response = await axios.post(
      apiUrl,
      { date: dateRange },
      { headers: { "Content-Type": "application/json" } }
    );

const totalstudentResponce = await axios.get(
  mathurastudenttotalapi, { headers: { "Content-Type": "application/json" } }


)

setTotalStudent(totalstudentResponce?.data || null);
console.log(" total student....... ", totalStudent)

console.log(" response data.............. ", response)
if(totalStudent!= null){
const processedData = response.data.map((result, index) => {
  const studentCount = result || 0; // Adjust based on API response structure
  const totalStudents = totalStudent ; // Replace with a dynamic value if needed
  return {
    day: dateRange[index] || "Unknown Day",
    totalStudents,
    presentStudents: studentCount,
    absentStudents: totalStudents - studentCount,
  };
});
console.log(response)
setChartData(processedData);
setShowTable(processedData);

}
   
  } catch (error) {
    toast.error("Error fetching or processing student data")
  
  }
  
  finally{
    setLoading(false)
  }

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
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Total Students</th>
                <th className="px-4 py-2">Present</th>
                <th className="px-4 py-2">Absent</th>
              </tr>
            </thead>
            <tbody>
              {showTable.map((data, index) => (
                <tr key={index}>
                  {/* <td className="px-4 py-2">{data.day}</td> */}
                  <td className="px-4 py-4  ">
                      {new Date(data.day).toLocaleDateString("en-US", {
                        weekday: "long", // "Thursday"
                        month: "long", // "January"
                        day: "2-digit", // "01"
                        year: "numeric", // "2025"
                      })}
                    </td>


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
