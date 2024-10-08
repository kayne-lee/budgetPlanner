import React, { useState } from 'react';
import "../styles/addTrans.css";

const AddTransactionForm = () => {
    const [category, setCategory] = useState('Income');
    const [type, setType] = useState('');
    const [amount, setAmount] = useState('');
    const [transactionDate, setTransactionDate] = useState('');
    const [description, setDescription] = useState('');

    const categoryTypes = {
        Income: ['Job', 'Side', 'Friends', 'Miscellaneous'],
        Spendings: ['Food', 'Groceries', 'Shopping', 'Rent', 'Miscellaneous'],
        Savings: ['Savings Account', 'Stocks', 'Crypto', 'Miscellaneous'],
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const user_id = localStorage.getItem("userId"); // Get userId from localStorage

        const response = await fetch("https://budgetplanner-v9zo.onrender.com/addTransaction", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                user_id, // Include userId in the request body
                category, 
                type, 
                amount, 
                transaction_date: transactionDate, 
                description 
            }),
        });

        if (response.ok) {
            // Reset the form
            setCategory('Income');
            setType('');
            setAmount('');
            setTransactionDate('');
            setDescription('');
        } else {
            const data = await response.json();
            console.error(data.error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add">
            <select value={category} onChange={(e) => {
                setCategory(e.target.value);
                setType(''); // Reset type when category changes
            }} required>
                <option value="Income">Income</option>
                <option value="Spendings">Spendings</option>
                <option value="Savings">Savings</option>
            </select>

            <select value={type} onChange={(e) => setType(e.target.value)} required>
                <option value="" disabled>Select type</option>
                {categoryTypes[category].map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                ))}
            </select>

            <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            <input type="date" value={transactionDate} onChange={(e) => setTransactionDate(e.target.value)} required />
            <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <button type="submit" className="button">Add Transaction</button>
        </form>
    );
};

export default AddTransactionForm;
