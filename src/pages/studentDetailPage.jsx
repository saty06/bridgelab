// import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
// import { motion } from "framer-motion";

import Header from "../components/common/Header";
// import StatCard from "../components/common/StatCard";
import StudentDetail from "../components/users/studentDetail";

const StudentDetailPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Learner's Historical Data"></Header>

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <StudentDetail />
      </main>
    </div>
  );
};
export default StudentDetailPage;
