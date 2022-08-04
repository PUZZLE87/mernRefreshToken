import { Routes, Route } from "react-router-dom";
import Editor from "./components/Editor";
import Home from "./components/Home";
import Login from "./components/Login";
import RequiredAuth from "./components/RequireAuth";
import Register from "./components/Rgister";
import Admin from "./components/Admin";
import Users from "./components/Users";
import Unauthorized from "./components/Unauthorized";
import NotFound from "./components/NotFound";

const ROLES = {
  User: 1000,
  Editor: 1002,
  Admin: 1001,
};

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* protected routes */}
        <Route element={<RequiredAuth allowedRoles={[ROLES.Editor]} />}>
          <Route path="/editor" element={<Editor />} />
        </Route>
        <Route element={<RequiredAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route
          element={<RequiredAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />}
        >
          <Route path="/users" element={<Users />} />
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
