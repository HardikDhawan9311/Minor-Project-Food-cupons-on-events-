// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Signup from "./Components/Auth/signup";
// import SignIn from "./Components/Auth/signin";
// import Home from "./Components/home/Home";
// import Setting from "./Components/Settings/SettingPage";
// import ImportPage from "./Components/Import/Import_Page";
// import LogsPage from "./Components/Logs_Page/logs_page";
// import ProtectedRoute from "./Components/ProtectedRoute";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Signup />} />
//         <Route path="/signin" element={<SignIn />} />

//         <Route
//           path="/home"
//           element={
//             <ProtectedRoute>
//               <Home />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/settings"
//           element={
//             <ProtectedRoute>
//               <Setting/>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/import"
//           element={
//             <ProtectedRoute>
//               <ImportPage/>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/logs"
//           element={
//             <ProtectedRoute>
//               <LogsPage/>
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;





// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./Components/Auth/signup";
import SignIn from "./Components/Auth/signin";
import Home from "./Components/home/Home";
import Setting from "./Components/Settings/SettingPage";
import ImportPage from "./Components/Import/Import_Page";
import LogsPage from "./Components/Logs_Page/logs_page";
import ProtectedRoute from "./Components/ProtectedRoute";
import Schedule from "./Components/Schedule/Schedule";
import { getToken } from "./utils/auth"; // ✅ make sure this path matches your folder structure

function App() {
  const token = getToken();

  return (
    <Router>
      <Routes>
        {/* ✅ Redirect if already logged in */}
        <Route
          path="/"
          element={token ? <Navigate to="/home" replace /> : <Signup />}
        />
        <Route
          path="/signin"
          element={token ? <Navigate to="/home" replace /> : <SignIn />}
        />

        {/* ✅ Protected Home Route */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Setting />
            </ProtectedRoute>
          }
        />

        <Route
          path="/import"
          element={
            <ProtectedRoute>
              <ImportPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/logs"
          element={
            <ProtectedRoute>
              <LogsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/schedule"
          element={
            
               <Schedule />
            
          }
        />
      
      </Routes>        
    </Router>
  );
}

export default App;
