// Budget.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import TokenExpirationCheck from '../TokenExpirationCheck/TokenExpirationCheck';
import LoginMenu from '../menu/loginmenu';
const Budget = () => {
    const [budgets, setBudgets] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newBudget, setNewBudget] = useState({ category: '', budget_amount: 0 });
    const [serverMessage, setServerMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [budgetToDelete, setBudgetToDelete] = useState(null);

    const handleClose = () => {
        setShowModal(false);
        setDeleteConfirmation(false)
        setServerMessage('');
        setErrorMessage('');
    };

    const handleShow = () => {
        setNewBudget({ category: '', budget_amount: 0 });
        setShowModal(true);
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const parsedValue = name === 'budget_amount' ? parseFloat(value) : value;
        setNewBudget((prevBudget) => ({ ...prevBudget, [name]: parsedValue }));
    };

    const handleDeleteBudget = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token || !budgetToDelete) {
                return; // Handle the case where the token is not available or budgetToDelete is not set
            }

            const response = await axios.delete(
                `http://134.209.223.38:3001/api/delete-budget/${budgetToDelete.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                // Filter out the deleted budget from the state
                setBudgets((prevBudgets) => prevBudgets.filter(budget => budget.id !== budgetToDelete.id));
                alert('Budget Deleted Successfully!');
                setErrorMessage('');
                handleClose();
            }
        } catch (error) {
            console.error('Error deleting budget:', error);
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                console.log('Token expired, Logging Out!!');
                window.location.href = 'http://localhost:3000/login';
            } else if (error.response.status === 500) {
                setServerMessage('');
                setErrorMessage(`Failed to delete budget: ${error.response.data.error}`);
            } else {
                setServerMessage('');
                setErrorMessage(`Failed to delete budget. ${error.response.data.error}`);
            }
        }
    };

    const showDeleteConfirmation = (budget) => {
        setBudgetToDelete(budget);
        setDeleteConfirmation(true);
    };

    const closeDeleteConfirmation = () => {
        setBudgetToDelete(null);
        setDeleteConfirmation(false);
    };

    const handleAddBudget = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return; // Handle the case where the token is not available (user not logged in)
            }

            const response = await axios.post(
                'http://134.209.223.38:3001/api/add-budget',
                newBudget,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setBudgets((prevBudgets) => [...prevBudgets, response.data.budget]);
                setServerMessage('Budget Added Successfully!');
                setErrorMessage('');
                handleClose();
            }
        } catch (error) {
            console.error('Error adding budget:', error);
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                console.log('Token expired,Logging Out!!')
                window.location.href = 'http://localhost:3000/login';
            } else if (error.response.status === 500) {
                setServerMessage('');
                setErrorMessage(`Failed to fetch budgets : ${error.response.data.error}`);
            } else {
                setServerMessage('');
                setErrorMessage(`Failed to fetch budgets. ${error.response.data.error}`);
            }
        }
    };

    useEffect(() => {
        const fetchBudgets = async () => {
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

                setBudgets(response.data);
            } catch (error) {
                console.error('Error fetching budgets:', error.message);
                if (error.response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = 'http://localhost:3000/login';
                }
                else {
                    setServerMessage('');
                    setErrorMessage(`Failed to fetch budgets. ${error.response.data.error}`);
                }
            }
        };

        fetchBudgets();
    }, []);

    return (
        <>
        <LoginMenu/>
            <div className="pt-3 pb-3">
                <div className="container">
                    <div className="row">
                        <div className='col-md-6 text-left'>
                            <h4 className="text-uppercase">Configured Budgets</h4>
                        </div>
                        <div className='col-md-6 text-right'>
                            <Button variant="primary" onClick={handleShow}>
                                Add A Budget
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-5 bg-light">
                <div className="container bg-white">
                    <div className="row">
                        <div className="col-md-12 mb-5">
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Category</th>
                                        <th>Budget Amount</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {budgets.map((budget, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{budget.category.charAt(0).toUpperCase() + budget.category.slice(1)}</td>
                                            <td>{budget.budget_amount}</td>
                                            <td><button onClick={() => showDeleteConfirmation(budget)} style={{ border: 'none', background: 'black', cursor: 'pointer', color: 'white' }}>Delete</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Budget Modal */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Budget</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="category">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter category"
                                name="category"
                                value={newBudget.category}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="budget_amount">
                            <Form.Label>Budget Amount</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter budget amount"
                                name="budget_amount"
                                value={newBudget.budget_amount}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        {/* Display server success message */}
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
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddBudget}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={deleteConfirmation} onHide={closeDeleteConfirmation}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Budget</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete the budget for {budgetToDelete?.category}?</p>
                    {/* Display server error message */}
                    {serverMessage && (
                            <div className="alert alert-success mt-3">
                                {serverMessage}
                            </div>
                        )}
                    {errorMessage && (
                        <div className="alert alert-danger mt-3">
                            {errorMessage}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeDeleteConfirmation}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteBudget}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default TokenExpirationCheck(Budget); // Apply the HOC to Budget
