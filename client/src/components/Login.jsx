import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
          const response = await fetch("https://budgetplanner-v9zo.onrender.com/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });
      
          const data = await response.json();
          if (response.ok) {
            console.log(data)
            localStorage.setItem("userId", data.userId); // Save username
            navigate("/dashboard");
          } else {
            console.error(data.error);
            setMessage(data.error)
            setMessageType('error');
          }
        } catch (error) {
          console.error("Login error:", error);
          setMessage(error)
        setMessageType('error');
        }
      };
      
      
      
  return (
    <div className="center">
      <img src="logo.png" alt="" width={200}/>
      <form className="form" onSubmit={handleSubmit}>
        {message && (
            <div className={`message ${messageType}`}>
                {message}
            </div>
        )}
        <span className="input-span">
            <label for="email" className="label">Email</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                name="email"
                id="email"
                />
        </span>
        <span className="input-span">
          <label for="password" className="label" >Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            name="password"
            id="password"
            />
        </span>
        <input className="submit" type="submit" value="Log in"></input>
        <span className="span">Don't have an account <Link to="/signup" className="link">Sign up</Link></span>
      </form>
    </div>
  )
}
