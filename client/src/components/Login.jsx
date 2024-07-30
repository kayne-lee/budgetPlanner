import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css'

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/login', {
                email,
                password,
            });
            console.log('Login successful', response.data);
            setMessage(response.data.message);
            setMessageType('success');
        } catch (error) {
            console.error(error);
            if (error.response) {
                setMessage(error.response.data.error);
            } else {
                setMessage('An error occurred');
            }
            setMessageType('error');
        }
    }
  return (
    <Fragment>
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
    </Fragment>
  )
}