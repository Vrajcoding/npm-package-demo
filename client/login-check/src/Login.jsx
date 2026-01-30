// client/src/Login.jsx
import React, { useState, useEffect } from "react";
import { GoogleAuthButton } from "google-auth-lite";
import axios from "axios";

const Login = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  

  console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  useEffect(() => {
    const checkSession = () => {
      const storedUser = localStorage.getItem("app_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const handleSuccess = async (credential) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/google", { token: credential });
      const userData = response.data.user;
      localStorage.setItem("app_user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleFailure = () => console.log("Google Sign-In failed.");

  const handleLogout = () => {
    localStorage.removeItem("app_user");
    setUser(null);
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loader}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>My App Login</h1>
        
        {!user ? (
          <div style={styles.authWrapper}>
            <p style={styles.subtitle}>Sign in with your Google account</p>
            <GoogleAuthButton
              clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
              onSuccess={handleSuccess}
              onFailure={handleFailure}
              theme="filled_black"
              width="280"
            />
          </div>
        ) : (
          <div style={styles.profileWrapper}>
            <img src={user.picture} alt="Profile" style={styles.avatar} />
            <h3 style={styles.welcome}>Welcome, {user.name}!</h3>
            <p style={styles.email}>{user.email}</p>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

// CSS-in-JS Styles
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f4f6f8",
    fontFamily: "'Roboto', sans-serif",
  },
  loader: {
    fontSize: "18px",
    color: "#5f6368",
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    textAlign: "center",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#202124",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#5f6368",
    marginBottom: "24px",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    marginBottom: "16px",
    border: "2px solid #e8eaed",
  },
  welcome: {
    margin: "0 0 8px 0",
    color: "#202124",
  },
  email: {
    margin: "0 0 24px 0",
    color: "#5f6368",
    fontSize: "14px",
  },
  logoutBtn: {
    padding: "10px 24px",
    border: "1px solid #dadce0",
    borderRadius: "4px",
    backgroundColor: "transparent",
    color: "#1a73e8",
    cursor: "pointer",
    fontWeight: "500",
  }
};

export default Login;