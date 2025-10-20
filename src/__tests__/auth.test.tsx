import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import SignInPage from '@/app/auth/signin/page'

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  getSession: jest.fn(),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockPush = jest.fn()

describe('SignInPage', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders sign in form', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: jest.fn(),
    })

    render(<SignInPage />)
    
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument()
    expect(screen.getByLabelText('Email address')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: jest.fn(),
    })

    render(<SignInPage />)
    
    const submitButton = screen.getByRole('button', { name: 'Sign in' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument()
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
    })
  })

  it('redirects authenticated admin to admin dashboard', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: '1',
          email: 'admin@test.com',
          name: 'Admin User',
          role: 'ADMIN',
        },
      },
      status: 'authenticated',
      update: jest.fn(),
    })

    render(<SignInPage />)
    
    expect(mockPush).toHaveBeenCalledWith('/admin')
  })

  it('redirects authenticated staff to staff dashboard', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: '1',
          email: 'staff@test.com',
          name: 'Staff User',
          role: 'STAFF',
        },
      },
      status: 'authenticated',
      update: jest.fn(),
    })

    render(<SignInPage />)
    
    expect(mockPush).toHaveBeenCalledWith('/staff')
  })

  it('redirects authenticated customer to dashboard', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: '1',
          email: 'customer@test.com',
          name: 'Customer User',
          role: 'CUSTOMER',
        },
      },
      status: 'authenticated',
      update: jest.fn(),
    })

    render(<SignInPage />)
    
    expect(mockPush).toHaveBeenCalledWith('/dashboard')
  })
})
