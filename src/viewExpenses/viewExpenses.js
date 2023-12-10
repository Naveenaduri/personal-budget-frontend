import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import LoginMenu from '../menu/loginmenu';
import TokenExpirationCheck from '../TokenExpirationCheck/TokenExpirationCheck';
function ViewExpenses() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const handleDateSubmit = async (e) => {
        e.preventDefault();

        if (!selectedDate) {
            setErrorMessage('Date is required.');
            return;
        }

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                // Handle the case where the token is not available (user not logged in)
                return;
            }

            const formattedDate = selectedDate.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD

            const response = await axios.get(`http://134.209.223.38:3001/api/getExpenses?date=${formattedDate}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200 && response.data.success) {
                // Handle the response, e.g., update state with expenses
                setExpenses(response.data.expenses);
                setErrorMessage('');
            } else {
                setErrorMessage(`Failed to fetch expenses: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Error fetching expenses:', error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                console.log('Token expired, Logging Out!!');
                window.location.href = 'http://192.241.143.128/login';
            } else if (error.response && error.response.status === 500) {
                setErrorMessage(`Failed to fetch expenses: ${error.response.data.error}`);
            }
        }
    };

    const handleDeleteExpense = async (expenseId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this expense?');

        if (!confirmDelete) {
            return;
        }

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                // Handle the case where the token is not available (user not logged in)
                return;
            }

            const response = await axios.delete(`http://134.209.223.38:3001/api/deleteExpense/${expenseId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200 && response.data.success) {
                // Expense deleted successfully, update state
                setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== expenseId));
                setErrorMessage('');
            } else {
                setErrorMessage(`Failed to delete expense: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                console.log('Token expired, Logging Out!!');
                window.location.href = 'http://192.241.143.128/login';
            } else if (error.response && error.response.status === 500) {
                setErrorMessage(`Failed to delete expense: ${error.response.data.error}`);
            }
        }
    };

    return (
        <>
            <LoginMenu />
            <div className="py-5 bg-light">
                <div className="container bg-white">
                    <div className="row">
                        <div className="col-md-12 mb-5">
                            <form onSubmit={handleDateSubmit} className="p-5">
                                <div className="row form-group">
                                    <div className="col-md-6 mb-3 mb-md-0">
                                        <label className="font-weight-bold" htmlFor="date">
                                            Select Date
                                        </label>
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
                                </div>
                                <div className="row form-group">
                                    <div className="col-md-12">
                                        <input
                                            type="submit"
                                            value="Submit"
                                            className="btn btn-primary text-white px-4 py-2"
                                        />
                                    </div>
                                </div>
                                {/* Display server error message */}
                                {errorMessage && (
                                    <div className="alert alert-danger mt-3">{errorMessage}</div>
                                )}
                            </form>
                        </div>
                    </div>
                    {/* Display either text or the expenses table */}
                    {expenses.length > 0 ? (
                        <div className="row">
                            <div className="col-md-12">
                                <h2>Expenses</h2>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Category</th>
                                            <th>Amount</th>
                                            <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expenses.map((expense) => (
                                            <tr key={expense.id}>
                                                <td>
                                                    {new Date(expense.date).toLocaleDateString()}
                                                </td>
                                                <td>{expense.categoryName}</td>
                                                <td>{expense.amount}</td>
                                                <td>
                                                    <button
                                                        onClick={() => handleDeleteExpense(expense.id)}
                                                        style={{
                                                            border: 'none',
                                                            background: 'black',
                                                            cursor: 'pointer',
                                                            color: 'white',
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="row">
                            <div className="col-md-12">
                                <p>No expenses available for the selected date.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default TokenExpirationCheck(ViewExpenses);
