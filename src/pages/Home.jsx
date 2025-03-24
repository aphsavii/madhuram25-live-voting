import React from "react";
import { Button } from "@/shadcn/ui/button";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
function Home() {
  const navigate = useNavigate();
  const onLoginSuccess = (response) => {
    console.log(response);
    const credentials = response.credential;
    localStorage.setItem("token", credentials);
    const decoded = jwtDecode(credentials);
    console.log(decoded);
    navigate("/dashboard");
  };

  return (
    <div className="w-full">
      <div className="contianer mx-auto px-4 h-screen py-8 lg:py-16 overflow-hidden">
        <div className="flex w-full items-center h-screen pb-24 lg:pb-28 overflow-hidden justify-center mt-8">
          <GoogleLogin size="large" onSuccess={onLoginSuccess} auto_select={true}>
            <Button>Sign in with Google</Button>
          </GoogleLogin>
        </div>
      </div>
    </div>
  );
}

export default Home;
