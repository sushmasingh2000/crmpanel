
import Area from "../Adminpages/Pages/allmaster/Area";
import FollowupMaster from "../Adminpages/Pages/allmaster/Followup";
import PropertyMaster from "../Adminpages/Pages/allmaster/Property";
import ServiceTypeMaster from "../Adminpages/Pages/allmaster/Services";
import Dashboard from "../Adminpages/Pages/dashboard/Dashboard";
import EmployeeList from "../Adminpages/Pages/employee/AllEmployee";
import CreateFollowup from "../Adminpages/Pages/followup/CreateFollowup";
import FollowupList from "../Adminpages/Pages/followup/FollowupList";
import CreateLead from "../Adminpages/Pages/lead/CreateLead";
import LeadList from "../Adminpages/Pages/lead/LeadList";
import CreateOwner from "../Adminpages/Pages/owner/CreateOwner";
import OwnerList from "../Adminpages/Pages/owner/OwnerList";
import CreateProperty from "../Adminpages/Pages/properties/CreatePropert";
import PropertyList from "../Adminpages/Pages/properties/ListProperties";


export const adminroutes = [ 

  {
    id: 2,
    path: "/admindashboard",
    component: <Dashboard />,
    navItem: "Dashboard",
  },
  //  {
  //   id: 2,
  //   path: "/master",
  //   component: <Master />,
  //   navItem: "Master",
  // },
  {
    id: 2,
    path: "/add-lead",
    component: <CreateLead />,
    navItem: "Create Leads",
  },
  {
    id: 2,
    path: "/leads",
    component: <LeadList />,
    navItem: " Leads",
  },
  {
    id: 3,
    path: "/follow-up",
    component: <FollowupList />,
    navItem: " Followup",
  },
   {
    id: 3,
    path: "/create-follow-up",
    component: <CreateFollowup />,
    navItem: "Add Followup",
  },
  {
    id: 4,
    path: "/list_properties",
    component: <PropertyList/>,
    navItem: "List Property",
  },
  {
    id: 5,
    path: "/create-property",
    component: <CreateProperty/>,
    navItem: "Create Property",
  },
   {
    id: 6,
    path: "/create-owner",
    component: <CreateOwner/>,
    navItem: "Create Owner",
  },
    {
    id: 7,
    path: "/list-owner",
    component: <OwnerList/>,
    navItem: " Owner",
  },

   {
    id: 8,
    path: "/list-services",
    component: <ServiceTypeMaster/>,
    navItem: " Services",
  },
    {
    id: 9,
    path: "/list-property-master",
    component: <PropertyMaster/>,
    navItem: " Property",
  },
   {
    id: 10,
    path: "/list-followup-master",
    component: <FollowupMaster/>,
    navItem: " FollowUp",
  },
 {
    id: 11,
    path: "/list_area",
    component: <Area/>,
    navItem: "Area Master",
  },
  {
    id: 12,
    path: "/employee_list",
    component: <EmployeeList/>,
    navItem: "Employee Detail",
  },
  
];