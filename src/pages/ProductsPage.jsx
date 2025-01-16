import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import{useEffect, useState} from 'react'
import axios from "axios";

import { AlertTriangle, Package, TrendingUp } from "lucide-react";
// import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
// import SalesTrendChart from "../components/products/SalesTrendChart";
import StudentTable from "../components/products/StudentTable";

const ProductsPage = () => {
	const [totapresentlStudent, setpresentTotalStudent] = useState(null);
	const [totalAbasent, setTotalAbasent] = useState(null);
  const[totalStudent, setTotalStudent] = useState(null);
  
	const totalPresetStudent = async () => {
    try {
      const response = await axios.post(
        "https://x8ki-letl-twmt.n7.xano.io/api:V6Q6GSfP/getstudentdetail",
        { check: true },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Attendance response data:", response?.data);
      setpresentTotalStudent(response?.data?.length);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };
  const totalAbasentStudent = async () => {
    try {
      const response = await axios.post(
        "https://x8ki-letl-twmt.n7.xano.io/api:V6Q6GSfP/getstudentdetail",
        { check: false },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Attendance response data:", response?.data);
      setTotalAbasent(response?.data?.length);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };
  const handleFetchTotalStudent = async () => {
    try {
      const response = await axios.get(
        "https://x8ki-letl-twmt.n7.xano.io/api:ufB-AVZm/studentdata",
        { headers: { "Content-Type": "application/json" } }
      );
      
    // Initialize filtered data
    setTotalStudent(response?.data?.length);
      console.log(response?.data);
      console.log(" smn")
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
	useEffect(() => {
  totalPresetStudent();
  totalAbasentStudent()
  handleFetchTotalStudent();
	}, []);
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Student Dashboard' />
      

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Present Student ' icon={Package} value={ totapresentlStudent!=null ? totapresentlStudent:0} color='#6366F1' />
					<StatCard name='Total Absent Student ' icon={TrendingUp} value={totalAbasent!=null ? totalAbasent: 0} color='#10B981' />
					<StatCard name='Total Student' icon={AlertTriangle} value={totalStudent!=null ? totalStudent: 0} color='#F59E0B' />
					
				</motion.div>

				<StudentTable />

				
			</main>
		</div>
	);
};
export default ProductsPage;
