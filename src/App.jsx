import MainHeader from "./assets/components/MainHeader";
import Landing from "./assets/components/Landing";
import MainMenu from "./assets/components/MainMenu";
import About from "./assets/components/About";
import Contact from "./assets/components/Contact";
import OrderStatus from "./assets/components/OrderStatus";
import SignUp from "./assets/components/SignUp";

import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App({ children }) {
  return (
    <Router>
      <section className="App">
      <MainHeader />
          <Routes>
            <Route path="/" element={<Landing>{children}</Landing>} />
            <Route path="/menu/*" element={<MainMenu />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/orders" element={<OrderStatus />} />
          </Routes>
      </section>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
