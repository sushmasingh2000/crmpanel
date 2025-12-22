
import FollowupMaster from "../Adminpages/Pages/allmaster/Followup";
import PropertyMaster from "../Adminpages/Pages/allmaster/Property";
import ServiceTypeMaster from "../Adminpages/Pages/allmaster/Services";
import Dashboard from "../Adminpages/Pages/dashboard/Dashboard";
import CreateFollowup from "../Adminpages/Pages/followup/CreateFollowup";
import FollowupList from "../Adminpages/Pages/followup/FollowupList";
import AddAddress from "../Adminpages/Pages/fund/AddAddress";
import { default as MatchingBonus } from "../Adminpages/Pages/genealogy/BoosterBonus";
import LevelBonus from "../Adminpages/Pages/genealogy/LevelBonus";
import ROIBonus from "../Adminpages/Pages/genealogy/ROIBonus";
import WeeklyBonus from "../Adminpages/Pages/genealogy/WeeklyBonus";
import CopierFund from "../Adminpages/Pages/INRPayment/CopierFund";
import INRPaying from "../Adminpages/Pages/INRPayment/INRPaying";
import INRPayout from "../Adminpages/Pages/INRPayment/INRPayout";
import CreateLead from "../Adminpages/Pages/lead/CreateLead";
import LeadList from "../Adminpages/Pages/lead/LeadList";
import CreateOwner from "../Adminpages/Pages/owner/CreateOwner";
import OwnerList from "../Adminpages/Pages/owner/OwnerList";
import CreateProperty from "../Adminpages/Pages/properties/CreatePropert";
import PropertyList from "../Adminpages/Pages/properties/ListProperties";
import ContactDetail from "../Adminpages/Pages/Team/Contactlist";
import CopierList from "../Adminpages/Pages/Team/CopierList";
import TraderRejct from "../Adminpages/Pages/Team/subinvestor/InvestorReject";
import TraderSucess from "../Adminpages/Pages/Team/subinvestor/InvestorSuccess";
import TraderList from "../Adminpages/Pages/Team/TraderList";
import UserDetail from "../Adminpages/Pages/Team/User";
import TopUp from "../Adminpages/Pages/Topup";
import TopUpDetail from "../Adminpages/Pages/TopUP/TopUpDetail";
import AdminTicketList from "../Adminpages/Ticket/List";


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
    id: 42,
    path: "/weeklybonus",
    component: <WeeklyBonus/>,
    navItem: "Weekly Recovery",
  },
  {
    id: 42,
    path: "/vipbonus",
    component: <ROIBonus/>,
    navItem: "Reward Bonus",
  },
  {
    id: 19,
    path: "/levelBonus",
    component: <LevelBonus/>,
    navItem: "Level Bonus",
  },
  {
    id: 19,
    path: "/matching",
    component: <MatchingBonus/>,
    navItem: "Matching Bonus",
  },
  {
    id: 42,
    path: "/inr_Paying",
    component: <INRPaying/>,
    navItem: "INR Paying",
  },
   {
    id: 42,
    path: "/copier_report",
    component: <CopierFund/>,
    navItem: "Copier List",
  },
  {
    id: 43,
    path: "/inr_Payout",
    component: <INRPayout/>,
    navItem: "INR Payout",
  },
  {
    id: 43,
    path: "/top_up",
    component: <TopUpDetail/>,
    navItem: "TopUp Detail",
  },
  {
    id: 43,
    path: "/user_detail",
    component: <UserDetail/>,
    navItem: "Member ",
  },

   {
    id: 43,
    path: "/trader_detail",
    component: <TraderList/>,
    navItem: "Invester ",
  },
   {
    id: 43,
    path: "/copier__detail",
    component: <CopierList/>,
    navItem: "Copier Detail",
  },
    {
    id: 43,
    path: "/contact",
    component: <ContactDetail/>,
    navItem: "Contact ",
  },
  {
    id: 43,
    path: "/ticket_list",
    component: <AdminTicketList/>,
    navItem: "Ticket ",
  },
  {
    id: 44,
    path: "/topup",
    component: <TopUp/>,
    navItem: "Manual Reward ",
  },
    {
    id: 45,
    path: "/admin_fund",
    component: <AddAddress/>,
    navItem: "Fund",
  },
  {
    id: 45,
    path: "/trader_sucess",
    component: <TraderSucess/>,
    navItem: "Verified Investor",
  },
  {
    id: 45,
    path: "/trader_reject",
    component: <TraderRejct/>,
    navItem: "Reject Investor ",
  },
  {
    id: 45,
    path: "/admin_fund",
    component: <AddAddress/>,
    navItem: "Fund",
  },
  
];