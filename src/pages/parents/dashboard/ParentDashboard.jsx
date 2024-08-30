import Header from "../../../components/common/parents/Header";
import ActiveStatus from "../../../components/parent/ActiveStatus/ActiveStatus";
import ClassesTable from "../../../components/parent/ClassesTable/ClassesTable";
import Grades from "../../../components/parent/Grades/Grades";
import Greetings from "../../../components/parent/Greetings/Greetings";
import ShowNotifications from "../../../components/parent/ShowNotifications/ShowNotifications";

const ParentDashboard = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
        <Header title="Dashboard" />

        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          {/*Notifications*/}
          <ShowNotifications />

          {/*Greetings*/}
          <Greetings />

          {/*Classes Table*/}
          <ClassesTable />

          {/*Active Status*/}
          <ActiveStatus />

          {/*Grades*/}
          <Grades />
        </main>
    </div>
  )
};
export default ParentDashboard;
