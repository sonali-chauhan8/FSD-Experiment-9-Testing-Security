import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import StudentList from '../pages/StudentList';
import { studentService } from '../services/api';

vi.mock('../services/api', () => ({
  studentService: {
    getAllStudents: vi.fn(),
    updateStudent: vi.fn(),
    deleteStudent: vi.fn(),
  },
}));

const mockStudents = [
  {
    _id: '673dfa10293a11b89ef41001',
    name: 'Aman Sharma',
    enrollmentNumber: '0101CS221001',
    email: 'aman.sharma@college.edu',
    branch: 'Computer Science & Engineering',
    semester: 5,
    mobileNumber: '9876543210',
  },
  {
    _id: '673dfa10293a11b89ef41002',
    name: 'Pooja Verma',
    enrollmentNumber: '0101IT221045',
    email: 'pooja.verma@college.edu',
    branch: 'Information Technology',
    semester: 6,
    mobileNumber: '9123456789',
  },
  {
    _id: '673dfa10293a11b89ef41003',
    name: 'Rohan Mehra',
    enrollmentNumber: '0101EC221012',
    email: 'rohan.mehra@college.edu',
    branch: 'Electronics & Communication Engineering',
    semester: 4,
    mobileNumber: '9811223344',
  },
];

describe('=== Frontend Testing: StudentList Component & Interactions ===', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <StudentList />
      </BrowserRouter>
    );
  };

  // 1. DATA RENDERING FROM MOCKED API
  it('fetches and renders students in table when component mounts', async () => {
    studentService.getAllStudents.mockResolvedValueOnce({
      success: true,
      data: mockStudents,
    });

    renderComponent();

    expect(await screen.findByText('Aman Sharma')).toBeInTheDocument();
    expect(screen.getByText('0101CS221001')).toBeInTheDocument();
    expect(screen.getByText('Pooja Verma')).toBeInTheDocument();
    expect(screen.getByText('Rohan Mehra')).toBeInTheDocument();
  });

  // 2. SEARCH INTERACTION BY NAME & ENROLLMENT
  it('filters students dynamically when typing into search input', async () => {
    const user = userEvent.setup();

    studentService.getAllStudents.mockResolvedValueOnce({
      success: true,
      data: mockStudents,
    });

    renderComponent();

    await screen.findByText('Aman Sharma');

    const searchInput = screen.getByPlaceholderText(
      /Search by student name, enrollment no, or email\.\.\./i
    );

    // Search by name
    await user.type(searchInput, 'Pooja');

    expect(screen.getByText('Pooja Verma')).toBeInTheDocument();
    expect(screen.queryByText('Aman Sharma')).not.toBeInTheDocument();
    expect(screen.queryByText('Rohan Mehra')).not.toBeInTheDocument();

    // Clear search
    await user.clear(searchInput);
    expect(screen.getByText('Aman Sharma')).toBeInTheDocument();
    expect(screen.getByText('Pooja Verma')).toBeInTheDocument();

    // Search by enrollment number
    await user.type(searchInput, '0101EC221012');
    expect(screen.getByText('Rohan Mehra')).toBeInTheDocument();
    expect(screen.queryByText('Aman Sharma')).not.toBeInTheDocument();
  });

  // 3. FILTER BY BRANCH DROPDOWN
  it('filters student records when branch option is selected', async () => {
    studentService.getAllStudents.mockResolvedValueOnce({
      success: true,
      data: mockStudents,
    });

    renderComponent();
    await screen.findByText('Aman Sharma');

    const branchSelect = screen.getByDisplayValue('All Branches');
    fireEvent.change(branchSelect, {
      target: { value: 'Information Technology' },
    });

    expect(screen.getByText('Pooja Verma')).toBeInTheDocument();
    expect(screen.queryByText('Aman Sharma')).not.toBeInTheDocument();
    expect(screen.queryByText('Rohan Mehra')).not.toBeInTheDocument();
  });

  // 4. FILTER BY SEMESTER DROPDOWN
  it('filters student records when semester option is selected', async () => {
    studentService.getAllStudents.mockResolvedValueOnce({
      success: true,
      data: mockStudents,
    });

    renderComponent();
    await screen.findByText('Aman Sharma');

    const semesterSelect = screen.getByDisplayValue('All Semesters');
    fireEvent.change(semesterSelect, { target: { value: '4' } });

    expect(screen.getByText('Rohan Mehra')).toBeInTheDocument();
    expect(screen.queryByText('Aman Sharma')).not.toBeInTheDocument();
    expect(screen.queryByText('Pooja Verma')).not.toBeInTheDocument();
  });

  // 5. API ERROR STATE
  it('renders error notification when API request fails', async () => {
    studentService.getAllStudents.mockRejectedValueOnce(
      new Error('Failed to connect to backend MongoDB cluster')
    );

    renderComponent();

    expect(
      await screen.findByText(/Failed to connect to backend MongoDB cluster/i)
    ).toBeInTheDocument();
  });
});
