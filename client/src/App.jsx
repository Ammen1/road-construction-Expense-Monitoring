import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Expenses from "./components/Expenses";
import AddUsers from "./pages/ManageUsers";
import CreatePost from "./pages/CreateProjects";
import Footer from "./components/Footer";
import UpdatePost from "./pages/UpdatePost";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-expense" element={<Expenses />} />
        <Route path="/add-users" element={<AddUsers />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/update-post/:projectId" element={<UpdatePost />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
