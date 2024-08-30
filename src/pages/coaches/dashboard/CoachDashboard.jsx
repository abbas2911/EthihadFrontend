import Header from "../../../components/common/coaches/Header";
import Greetings from "../../../components/coach/Greetings/Greetings";
import ClassesTable from "../../../components/coach/ClassesTable/ClassesTable";

const CoachDashboard = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
        <Header title="Dashboard" />

        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          {/*Greetings*/}
          <Greetings />

          {/*ClassTable*/}
          <ClassesTable />
          
        </main>
    </div>
  )
};
export default CoachDashboard;
