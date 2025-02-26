import Login from "./pages/common/Login";
import { ThemeProvider } from "./context/ThemeContext";
import Landing from "./pages/common/Landing";
import SignUp from "./pages/common/SignUp";
import Otp from "./pages/common/Otp";

const App = () => {
    return (
        <div>
            <ThemeProvider>
                {/* <Landing /> */}
                {/* <Login/> */}
                {/* <SignUp/> */}
                <Otp/>
            </ThemeProvider>
        </div>
    )
};

export default App