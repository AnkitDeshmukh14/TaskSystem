import { BrowserRouter, Routes, Route, Navigate,} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TaskDetails from "./pages/Taskdetails";
import CreateTask from "./pages/Createtask";
import ProtectedRoute from "./components/ProtectedRoute";
import EditTask from "./pages/Edittask";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={ <ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/tasks/create" element={<ProtectedRoute><CreateTask/></ProtectedRoute>} />
        <Route path="/tasks/:id/edit" element={<ProtectedRoute><EditTask/></ProtectedRoute>} />
        <Route path="/tasks/:id" element={<ProtectedRoute><TaskDetails/></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;