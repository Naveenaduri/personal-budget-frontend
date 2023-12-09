import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import LoginMenu from '../menu/loginmenu';
function AddExpenses() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState({});
    const [expenseAmount, setExpenseAmount] = useState('');
    const [budgetCategories, setBudgetCategories] = useState([]);
    const [serverMessage, setServerMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Fetch budget categories from the server
        const fetchBudgetCategories = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    return;
                }

                const response = await axios.get('http://134.209.223.38:3001/api/budgets', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data)
                setBudgetCategories(response.data);
            } catch (error) {
                console.error('Error fetching budget categories:', error.message);
                if (error.response.status === 401) {
                    localStorage.removeItem('token');
                    alert("Token Expired!! You'll be logged out now.")
                    window.location.href = 'http://192.241.143.128/login';
                } else if (error.response.status === 500) {
                    setServerMessage('');
                    setErrorMessage(`Failed to add expenses : ${error.response.data.error}`);
                } else {
                    setServerMessage('');
                    setErrorMessage(`Failed to fetch expense : ${error.response.data.error}`);
                }            }
        };

        fetchBudgetCategories();
    }, []); // Empty dependency array ensures that the effect runs only once

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedDate || !selectedCategory.category || !expenseAmount.trim()) {
            setServerMessage('');
            setErrorMessage('Date, category, and expense amount are required.');
            return;
        }

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                // Handle the case where the token is not available (user not logged in)
                return;
            }

            const formattedDate = selectedDate.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD

            const response = await axios.post(
                'http://134.209.223.38:3001/api/addExpense',
                {
                    date: formattedDate,
                    categoryId: selectedCategory.id,
                    categoryName: selectedCategory.category,
                    amount: parseInt(expenseAmount),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                // Handle the response, e.g., show success message, update state, etc.
                setServerMessage('Expense added successfully');
                setErrorMessage('');
                setSelectedDate(null);
            setSelectedCategory({});
            setExpenseAmount('');
            }

            // Handle the response, e.g., show success message, update state, etc.
            console.log('Expense added successfully:', response.data);
        } catch (error) {
            console.error('Error adding expense:', error);
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                console.log('Token expired,Logging Out!!')
                window.location.href = 'http://192.241.143.128/login';
            } else if (error.response.status === 500) {
                setServerMessage('');
                if(error.response.data.error.includes('Duplicate Entry')){
                    setErrorMessage(`Duplicate Entry for Expense`);
                } else{
                    setErrorMessage(`Failed to add expenses : ${error.response.data.error}`);
                }
            } else {
                setServerMessage('');
                setErrorMessage(`Failed to fetch expense : ${error.response.data.error}`);
            }        
        }
    };

    return (
        <>
            <LoginMenu/>
        <div className="py-5 bg-light">
            <div className="container bg-white">
                <div className="row">
                    <div className="col-md-12 mb-5">
                        <form onSubmit={handleSubmit} className="p-5">
                            <div className="row form-group">
                                <div className="col-md-6 mb-3 mb-md-0">
                                    <label className="font-weight-bold" htmlFor="date">Date</label>
                                    <div style={{ width: '100%' }}>
                                        <DatePicker
                                            dateFormat="MMMM yyyy"
                                            showMonthYearPicker
                                            selected={selectedDate}
                                            onChange={(date) => setSelectedDate(date)}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3 mb-md-0">
                                    <label className="font-weight-bold" htmlFor="category">Category</label>
                                    <select
                                        id="category"
                                        className="form-control"
                                        onChange={(e) => {
                                            const selectedCategoryObject = budgetCategories.find(category => category.category === e.target.value);
                                            setSelectedCategory(selectedCategoryObject || {});
                                        }}
                                    >
                                        <option value="">Select category</option>
                                        {budgetCategories.map((category) => (
                                            <option key={category.id} value={category.category}>
                                                {category.category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="row form-group">
                                <div className="col-md-6">
                                    <label className="font-weight-bold" htmlFor="expenseAmount">Expense Amount</label>
                                    <input
                                        type="number"
                                        id="expenseAmount"
                                        className="form-control"
                                        placeholder="Enter expense amount"
                                        onChange={(e) => setExpenseAmount(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="row form-group">
                                <div className="col-md-12">
                                    <input type="submit" value="Submit" className="btn btn-primary text-white px-4 py-2" />
                                </div>
                            </div>
                            {serverMessage && (
                                <div className="alert alert-success mt-3">
                                    {serverMessage}
                                </div>
                            )}
                            {/* Display server error message */}
                            {errorMessage && (
                                <div className="alert alert-danger mt-3">
                                    {errorMessage}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default AddExpenses;
