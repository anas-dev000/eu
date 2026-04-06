import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Communication from "./pages/Communication";
import Sessions from "./pages/Sessions";
import Podcasts from "./pages/Podcasts";
import Games from "./pages/Games";
import Interaction from "./pages/Interaction";
import Stories from "./pages/Stories";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/about" element={<About />} />
        <Route path="/communication" element={<Communication />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/podcasts" element={<Podcasts />} />
        <Route path="/games" element={<Games />} />
        <Route path="/interaction" element={<Interaction />} />
        <Route path="/stories" element={<Stories />} />
      </Routes>
    </Router>
  );
};

export default App;
