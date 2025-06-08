import { getUsers, getUserById } from '../users';
import { userApi } from '@/lib/api/users';
import { API_CONFIG } from '@/config';

// Mock the userApi
jest.mock('@/lib/api/users');
const mockedUserApi = userApi as jest.Mocked<typeof userApi>;

// Mock fetch
global.fetch = jest.fn();
const mockedFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('User Server Actions', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    company: { name: 'Test Company' },
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return users successfully', async () => {
      mockedUserApi.getUsers.mockResolvedValue([mockUser]);

      const result = await getUsers();

      expect(result).toEqual({ data: [mockUser], error: null });
      expect(mockedUserApi.getUsers).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch users');
      mockedUserApi.getUsers.mockRejectedValue(error);

      const result = await getUsers();

      expect(result).toEqual({ data: null, error: 'Failed to fetch users' });
    });
  });

  describe('getUserById', () => {
    it('should return a user by id successfully', async () => {
      mockedFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockUser)
      } as Response);

      const result = await getUserById('1');

      expect(result).toEqual({ data: mockUser, error: null });
      expect(mockedFetch).toHaveBeenCalledWith(`${API_CONFIG.BASE_URL}/users/1`);
    });

    it('should handle non-ok response', async () => {
      mockedFetch.mockResolvedValue({
        ok: false
      } as Response);

      const result = await getUserById('1');

      expect(result).toEqual({ data: null, error: 'Failed to fetch user' });
    });

    it('should handle network errors', async () => {
      mockedFetch.mockRejectedValue(new Error('Network error'));

      const result = await getUserById('1');

      expect(result).toEqual({ data: null, error: 'Network error' });
    });
  });
}); 