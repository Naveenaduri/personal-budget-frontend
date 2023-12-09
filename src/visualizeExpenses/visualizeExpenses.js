import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as d3 from 'd3';
import PieChart from './PieChart';
import Barchart from './BarChart';
import LineChart from './LineChart';
import LoginMenu from '../menu/loginmenu';

const VisualizeExpenses = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const handleDateSubmit = async (e) => {
        e.preventDefault();

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
                // Reset expenses state when a new date is selected
                setExpenses(response.data.expenses);
                setErrorMessage('');
            } else {
                setErrorMessage(`Failed to fetch expenses: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Error fetching expenses:', error);
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                console.log('Token expired, Logging Out!!');
                window.location.href = 'http://localhost:3000/login';
            } else if (error.response && error.response.status === 500) {
                setErrorMessage(`Failed to fetch expenses: ${error.response.data.error}`);
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
                                        <label className="font-weight-bold" htmlFor="date">Select Date</label>
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
                                        <input type="submit" value="Submit" className="btn btn-primary text-white px-4 py-2" />
                                    </div>
                                </div>
                                {/* Display server error message */}
                                {errorMessage && (
                                    <div className="alert alert-danger mt-3">
                                        {errorMessage}
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                    {/* Conditionally render visualizations or text message */}
                    {expenses.length > 0 ? (
                        <div className="row">
                            <div className="col-md-4">
                                <h3>Bar Chart</h3>
                                <Barchart expenses={expenses} />
                            </div>
                            <div className="col-md-4">
                                <h3>Pie Chart</h3>
                                <PieChart expenses={expenses} outerRadius={100} innerRadius={0} />
                            </div>
                            <div className="col-md-4">
                                <h3>Line Chart</h3>
                                <LineChart expenses={expenses} />
                            </div>
                        </div>
                    ) : (
                        <div className="row">
                            <div className="col-md-12">
                                <p>No data available for the selected month.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default VisualizeExpenses;
