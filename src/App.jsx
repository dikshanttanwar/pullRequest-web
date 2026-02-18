import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./Body";
import Home from "./Home";
import Login from "./Login";

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            <Route index element={<Home />} />
            <Route path="/signup" element={"Welcome to the Page - Signup Please"} />
            <Route path="/login" element={<Login />} />
            <Route path="/feed" element={"Feed Page!!"}/>
            <Route path="/connections" element={"Connections Page!!"}/>


            <Route path="*" element={"404 Not Found!"} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
