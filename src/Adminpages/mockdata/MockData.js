import { LeaderboardSharp } from "@mui/icons-material";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
const user_type = localStorage.getItem("type")

export const all_Data = [

  {
    id: 2,
    navLink: "/admindashboard",
    navItem: "Dashboard",
    navIcon: (
      <span>
        <DashboardCustomizeIcon color="#15317E" fontSize="medium" />
      </span>
    ),
    subcomponent: [],
  },

  {
    id: 1,
    navLink: "/list-services",
    navItem: "Master",
    navIcon: (
      <span>
        <LeaderboardSharp color="#15317E" fontSize="medium" />
      </span>
    ),
    subcomponent: [
      {
        id: 1.2,
        navLink: "/list-services",
        navItem: " Services",
        navIcon: (
          <span>
            <AddToPhotosIcon color="#15317E" fontSize="medium" />
          </span>
        ),
        subcomponent: [],
      },
      {
        id: 1.3,
        navLink: "/list-property-master",
        navItem: " Property",
        navIcon: (
          <span>
            <AddToPhotosIcon color="#15317E" fontSize="medium" />
          </span>
        ),
        subcomponent: [],
      },
      {
        id: 1.4,
        navLink: "/list_area",
        navItem: "Area",
        navIcon: (
          <span>
            <AddToPhotosIcon color="#15317E" fontSize="medium" />
          </span>
        ),
        subcomponent: [],
      },

    ],
  },
  {
    id: 5,
    navLink: "/employee_list",
    navItem: "Employee",
    navIcon: (
      <span>
        <AddToPhotosIcon color="#15317E" fontSize="medium" />
      </span>
    ),
    subcomponent: [],
  },

  {
    id: 14,
    navLink: "/owner_list_properties",
    navItem: " Properties ",
    navIcon: (
      <span>
        <AddToPhotosIcon color="#15317E" fontSize="medium" />
      </span>
    ),
    subcomponent: [],
  },

  {
    id: 4,
    navLink: "/list-owner",
    navItem: "Owner",
    navIcon: (
      <span>
        <DashboardCustomizeIcon color="#15317E" fontSize="medium" />
      </span>
    ),
    subcomponent: [],
  },
  {
    id: 14,
    navLink: "/leads",
    navItem: " Leads ",
    navIcon: (
      <span>
        <AddToPhotosIcon color="#15317E" fontSize="medium" />
      </span>
    ),
    subcomponent: [],
  },

]?.filter((i) => {
  if (user_type === "admin") return true;

  if (user_type === "employee") {
    return  i.navItem !== "Master" && i.navItem !== "Employee";
  }
 
  return false;
});