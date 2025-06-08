import axios from 'axios';
import { userApi } from '../users';
import { API_CONFIG } from '@/config';
import { User } from '@/types';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('userApi', () => {
  const mockUser: User = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    phone: '123-456-7890',
    company: {
      name: 'Test Company'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should fetch all users', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [mockUser] });

      const result = await userApi.getUsers();

      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_CONFIG.BASE_URL}/users`);
      expect(result).toEqual([mockUser]);
    });

    it('should handle API errors', async () => {
      const error = new Error('Network error');
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(userApi.getUsers()).rejects.toThrow('Network error');
    });
  });

  describe('getUserById', () => {
    it('should fetch a single user by id', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockUser });

      const result = await userApi.getUserById(1);

      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_CONFIG.BASE_URL}/users/1`);
      expect(result).toEqual(mockUser);
    });

    it('should handle API errors', async () => {
      const error = new Error('User not found');
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(userApi.getUserById(999)).rejects.toThrow('User not found');
    });
  });
}); 