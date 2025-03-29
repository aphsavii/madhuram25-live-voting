import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
    <GoogleOAuthProvider clientId="839790399128-ngaafthv18ofctji2en78qlnqgj2mca4.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
);
