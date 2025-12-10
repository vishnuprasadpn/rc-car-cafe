import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import BookPage from '@/app/book/page'

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock fetch
global.fetch = jest.fn()

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockPush = jest.fn()

describe('BookPage', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    })

    // Mock successful games fetch
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        games: [
          {
            id: '1',
            name: 'Racing Track 1',
            description: 'Fast track for experienced racers',
            duration: 20,
            price: 500,
          },
        ],
      }),
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders booking form for authenticated user', async () => {
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

    render(<BookPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Book a Race')).toBeInTheDocument()
      expect(screen.getByText('Select Game')).toBeInTheDocument()
      expect(screen.getByText('Date')).toBeInTheDocument()
      expect(screen.getByText('Time')).toBeInTheDocument()
      expect(screen.getByText('Number of Players')).toBeInTheDocument()
    })
  })

  it('redirects unauthenticated user to sign in', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: jest.fn(),
    })

    render(<BookPage />)
    
    expect(mockPush).toHaveBeenCalledWith('/auth/signin')
  })

  it('shows game details when game is selected', async () => {
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

    render(<BookPage />)
    
    await waitFor(() => {
      const gameSelect = screen.getByDisplayValue('Choose a game...')
      fireEvent.change(gameSelect, { target: { value: '1' } })
    })

    await waitFor(() => {
      expect(screen.getByText('Racing Track 1')).toBeInTheDocument()
      expect(screen.getByText('Fast track for experienced racers')).toBeInTheDocument()
      expect(screen.getByText('20 minutes')).toBeInTheDocument()
      expect(screen.getByText('₹500 per player')).toBeInTheDocument()
    })
  })

  it('shows booking summary with calculated total', async () => {
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

    render(<BookPage />)
    
    await waitFor(() => {
      const gameSelect = screen.getByDisplayValue('Choose a game...')
      fireEvent.change(gameSelect, { target: { value: '1' } })
    })

    await waitFor(() => {
      const playersSelect = screen.getByDisplayValue('1 Player')
      fireEvent.change(playersSelect, { target: { value: '2' } })
    })

    await waitFor(() => {
      expect(screen.getByText('Total: ₹1000')).toBeInTheDocument()
    })
  })

  it('submits booking form successfully', async () => {
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

    // Mock successful booking creation
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          games: [
            {
              id: '1',
              name: 'Racing Track 1',
              description: 'Fast track for experienced racers',
              duration: 20,
              price: 500,
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          booking: {
            id: 'booking-1',
            gameId: '1',
            startTime: '2024-01-01T10:00:00Z',
            endTime: '2024-01-01T10:20:00Z',
            players: 2,
            totalPrice: 1000,
          },
        }),
      })

    render(<BookPage />)
    
    await waitFor(() => {
      const gameSelect = screen.getByDisplayValue('Choose a game...')
      fireEvent.change(gameSelect, { target: { value: '1' } })
    })

    await waitFor(() => {
      const dateInput = screen.getByLabelText('Date')
      fireEvent.change(dateInput, { target: { value: '2024-01-01' } })
    })

    await waitFor(() => {
      const timeInput = screen.getByLabelText('Time')
      fireEvent.change(timeInput, { target: { value: '10:00' } })
    })

    await waitFor(() => {
      const playersSelect = screen.getByDisplayValue('1 Player')
      fireEvent.change(playersSelect, { target: { value: '2' } })
    })

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: 'Create Booking' })
      fireEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard?success=booking_created')
    })
  })
})
