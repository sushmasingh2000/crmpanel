import "animate.css";
import "aos/dist/aos.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "../src/index.css";
import "./App.css";
import LogIn from "./Adminpages/Authentication/Login";
import AdminLayout from "./Adminpages/Layout";
import { adminroutes } from "./AdminRoutes";

const App = () => {
  const user = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogIn />} />

        {user ? (
          adminroutes.map((route, i) => (
            <Route
              key={i}
              path={route.path}
              element={
                <AdminLayout
                  id={route.id}
                  navLink={route.path}
                  navItem={route.navItem}
                  component={route.component}
                />
              }
            />
          ))
        ) : (
          <Route path="*" element={<LogIn />} />
        )}
    
      </Routes>
    </Router>
  );
};

export default App;
