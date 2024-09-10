"use client";

import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState, useEffect } from "react";

const GoogleAuth = ({ setGUser }) => {
  const [user, setUser] = useState([]);
  const [profile, setProfile] = useState([]);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUser(codeResponse);
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}auth/create-tokens`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            Accept: "application/json",
          },
          body: {
            code: user.access_token,
          },
        })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => console.log(err));
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  console.log(user.access_token);

  //   useEffect(() => {
  //     if (!user) return;

  //   }, [user]);

  // log out function to log the user out of google and set the profile array to null
  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  //   console.log(profile);

  return (
    <button
      onClick={() => login()}
      className="bg-primary-light hover:bg-primary-light/75 transition-all text-primary-dark px-4 py-2 rounded-md"
    >
      Authorize Google Calendar
    </button>
  );
};

export default GoogleAuth;
