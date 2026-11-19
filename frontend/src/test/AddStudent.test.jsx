import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AddStudent from '../pages/AddStudent';
import { studentService } from '../services/api';

// Mock studentService API methods
vi.mock('../services/api', () => ({
  studentService: {
    createStudent: vi.fn(),
  },
}));

describe('=== Frontend Testing: AddStudent Form Component ===', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <AddStudent />
      </BrowserRouter>
    );
  };

  // 1. FORM RENDERING TEST
  it('renders all form input fields, labels, and action buttons', () => {
    renderComponent();

    expect(screen.getByText(/Register New Student/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. Priyanshu Verma/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. 0101CS221045/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/student@college\.edu\.in/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/10-digit mobile number/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Save to MongoDB/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reset Form/i })).toBeInTheDocument();
  });

  // 2. REQUIRED FIELD VALIDATION TEST
  it('validates required fields and shows error messages when submitted empty', async () => {
    renderComponent();
    const submitBtn = screen.getByRole('button', { name: /Save to MongoDB/i });

    // Submit without filling form
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Full name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Enrollment number is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Email address is required/i)).toBeInTheDocument();

    // Ensure mock API was not called
    expect(studentService.createStudent).not.toHaveBeenCalled();
  });

  // 3. EMAIL FORMAT VALIDATION TEST
  it('shows error message when an invalid email format is entered', async () => {
    const user = userEvent.setup();
    renderComponent();

    const nameInput = screen.getByPlaceholderText(/e\.g\. Priyanshu Verma/i);
    const enrollInput = screen.getByPlaceholderText(/e\.g\. 0101CS221045/i);
    const emailInput = screen.getByPlaceholderText(/student@college\.edu\.in/i);
    const submitBtn = screen.getByRole('button', { name: /Save to MongoDB/i });

    await user.type(nameInput, 'Rohan Gupta');
    await user.type(enrollInput, '0101CS221088');
    await user.type(emailInput, 'invalid-email-no-at-sign');

    await user.click(submitBtn);

    expect(await screen.findByText(/Please enter a valid email address/i)).toBeInTheDocument();
    expect(studentService.createStudent).not.toHaveBeenCalled();
  });

  // 4. USER INTERACTION: RESET BUTTON
  it('resets form fields and clears errors when Reset Form is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    const nameInput = screen.getByPlaceholderText(/e\.g\. Priyanshu Verma/i);
    const resetBtn = screen.getByRole('button', { name: /Reset Form/i });

    await user.type(nameInput, 'Partial Entry');
    expect(nameInput).toHaveValue('Partial Entry');

    await user.click(resetBtn);
    expect(nameInput).toHaveValue('');
  });

  // 5. MOCK API REQUEST & SUCCESS INTERACTION
  it('submits valid student data and renders success notification via mocked API', async () => {
    const user = userEvent.setup();

    studentService.createStudent.mockResolvedValueOnce({
      success: true,
      data: {
        _id: '673dfa10293a11b89ef41234',
        name: 'Aditya Sharma',
        enrollmentNumber: '0101CS221001',
        email: 'aditya.sharma@college.edu',
        branch: 'Computer Science & Engineering',
        semester: 5,
        mobileNumber: '9876543210',
      },
    });

    renderComponent();

    const nameInput = screen.getByPlaceholderText(/e\.g\. Priyanshu Verma/i);
    const enrollInput = screen.getByPlaceholderText(/e\.g\. 0101CS221045/i);
    const emailInput = screen.getByPlaceholderText(/student@college\.edu\.in/i);
    const submitBtn = screen.getByRole('button', { name: /Save to MongoDB/i });

    await user.type(nameInput, 'Aditya Sharma');
    await user.type(enrollInput, '0101CS221001');
    await user.type(emailInput, 'aditya.sharma@college.edu');

    await user.click(submitBtn);

    await waitFor(() => {
      expect(studentService.createStudent).toHaveBeenCalledTimes(1);
    });

    expect(await screen.findByText(/was successfully registered in MongoDB!/i)).toBeInTheDocument();
  });

  // 6. MOCK API ERROR HANDLING
  it('displays server error notification when API call rejects', async () => {
    const user = userEvent.setup();

    studentService.createStudent.mockRejectedValueOnce(
      new Error('A student with Enrollment Number "0101CS221001" is already registered.')
    );

    renderComponent();

    const nameInput = screen.getByPlaceholderText(/e\.g\. Priyanshu Verma/i);
    const enrollInput = screen.getByPlaceholderText(/e\.g\. 0101CS221045/i);
    const emailInput = screen.getByPlaceholderText(/student@college\.edu\.in/i);
    const submitBtn = screen.getByRole('button', { name: /Save to MongoDB/i });

    await user.type(nameInput, 'Aditya Sharma');
    await user.type(enrollInput, '0101CS221001');
    await user.type(emailInput, 'aditya.sharma@college.edu');

    await user.click(submitBtn);

    expect(
      await screen.findByText(/A student with Enrollment Number "0101CS221001" is already registered\./i)
    ).toBeInTheDocument();
  });
});
