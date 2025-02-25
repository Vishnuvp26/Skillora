import Login from "./pages/common/Login";
import { ThemeProvider } from "./context/ThemeContext";
import Landing from "./pages/common/Landing";
import SignUp from "./pages/common/SignUp";

const App = () => {
    return (
        <div>
            <ThemeProvider>
                {/* <Landing /> */}
                {/* <Login/> */}
                <SignUp/>
            </ThemeProvider>
        </div>
    )
};

export default App