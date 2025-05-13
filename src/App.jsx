import MainHeader from "./assets/components/MainHeader";
import Landing from "./assets/components/Landing";
import MainMenu from "./assets/components/MainMenu";
import About from "./assets/components/About";
import Contact from "./assets/components/Contact";
import OrderStatus from "./assets/components/OrderStatus";
import UpdateOrder from "./assets/components/UpdateOrder";
import SignUp from "./assets/components/SignUp";
import LogIn from "./assets/components/LogIn";
import PaymentSucess from "./assets/components/PaymentSucess";

import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VerifyEmail from "./assets/components/VerifyEmail";
import Feedback from "./assets/components/Feedback";

function App({ children }) {
  return (
    <Router>
      <section className="App">
      <MainHeader />
          <Routes>
            <Route path="/" element={<Landing>{children}</Landing>} />
            <Route path="/menu/*" element={<MainMenu />} />
            <Route path="/about" element={<><About /><Contact /></>} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/orders" element={<OrderStatus />} />
            <Route path="/orders/:orderId" element={<UpdateOrder />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/payment/:totalPrice/:orderId" element={<PaymentSucess />} />
        <Route path="/payment" element={<PaymentSucess />} />
      </Routes>
      </section>
    </Router>
  );
}

export default App;
