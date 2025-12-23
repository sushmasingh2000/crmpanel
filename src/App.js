import "animate.css";
import "aos/dist/aos.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "../src/index.css";
import "./App.css";

import LogIn from "./Adminpages/Authentication/Login";
import AdminLayout from "./Adminpages/Layout";
import { adminroutes } from "./AdminRoutes";
import SignUp from "./Adminpages/Authentication/Signup";

const App = () => {
  const user = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<ForgotPassword />} /> */}
        <Route path="/sign_up" element={<SignUp />} />
  
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
    
        {/* {user ? (
          routes.map((route, i) => (
            <Route key={i} path={route.path} element={route.element} />
          ))
        ) : (
          <Route path="*" element={<Dashboard />} />
        )} */}
      </Routes>
    </Router>
  );
};

export default App;
