import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import ImageBackground from "../image/image";
import { Oval  } from "react-loader-spinner";
import './style.css'

const StudentTable = ({ compushName }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [collegeName, setCollegeName] = useState(compushName);
  const [loading, setLoading] = useState(false);

  // Fetch data from the backend
  const handleFetchData = async (college) => {
    setLoading(true);
    try {
      let response;
      if (college === "Technocrats") {
        response = await axios.get(
          "https://x8ki-letl-twmt.n7.xano.io/api:ufB-AVZm/studentdata",
          { headers: { "Content-Type": "application/json" } }
        );
      } else if (college === "Mathura") {
        response = await axios.get(
          "https://x8ki-letl-twmt.n7.xano.io/api:2aSKmYpj/mathurastudent",
          { headers: { "Content-Type": "application/json" } }
        );
      }
      if (response?.data) {
        setProducts(response.data);
        setFilteredProducts(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    finally{
      setLoading(false);
    }
  };

  // Update `collegeName` and fetch data when `compushName` changes
  useEffect(() => {
    setCollegeName(compushName);
    handleFetchData(compushName);
  }, [compushName]);
  console.log(collegeName)

  // Search filter
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = products.filter(
      (product) =>
        product.Name.toLowerCase().includes(term) ||
        product.Email_Id.toLowerCase().includes(term) ||
        product.BL_Engineer.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  };

  return (
    <>
      {products.length > 0 && (
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
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

            <h2 className="text-xl font-semibold text-gray-100">Student List</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search students..."
                className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleSearch}
                value={searchTerm}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
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
                    Program
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Tech Stack
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Cohort
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Engineer
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-700">
                {filteredProducts?.map((student) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                      {student.Name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {student.Email_Id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {student.Course_Program}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {student.Lab || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {student.Cohort}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {student.BL_Engineer}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
      {products.length <= 0 && <ImageBackground />}
    </>
  );
};

export default StudentTable;
