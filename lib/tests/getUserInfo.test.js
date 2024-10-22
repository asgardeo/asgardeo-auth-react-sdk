// Import the necessary modules
import AuthAPI from '../src/api'; // Adjust the path as needed
import { AsgardeoSPAClient } from '@asgardeo/auth-spa'; // Adjust the path as needed

// Mock the AsgardeoSPAClient module
jest.mock('@asgardeo/auth-spa', () => ({
    AsgardeoSPAClient: {
        getInstance: jest.fn(), // Mock getInstance method
    },
}));

describe('AuthAPI getBasicUserInfo()', () => {
    let authAPI;
    let mockClient;

    beforeEach(() => {
        // Step 1: Create a mock client with the getBasicUserInfo method
        mockClient = {
            getBasicUserInfo: jest.fn(), // Mock getBasicUserInfo
        };

        // Step 2: Mock getInstance to return the mock client
        AsgardeoSPAClient.getInstance.mockReturnValue(mockClient);

        // Step 3: Instantiate AuthAPI (this will assign the mock client to _client)
        authAPI = new AuthAPI();
    });

    afterEach(() => {
        // Clear all mocks after each test
        jest.clearAllMocks();
    });

    it('should return basic user information when getBasicUserInfo is called', async () => {
        // Arrange: Mock the resolved value for getBasicUserInfo
        const mockUserInfo = {
            username: 'john.doe',
            email: 'john.doe@example.com',
        };
        mockClient.getBasicUserInfo.mockResolvedValue(mockUserInfo);

        // Act: Call the getBasicUserInfo method
        const result = await authAPI.getBasicUserInfo();

        // Assert: Check if the result is the expected mockUserInfo
        expect(result).toEqual(mockUserInfo);
        expect(mockClient.getBasicUserInfo).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when getBasicUserInfo fails', async () => {
        // Arrange: Mock a rejected promise to simulate an error
        const mockError = new Error('Failed to fetch user info');
        mockClient.getBasicUserInfo.mockRejectedValue(mockError);

        // Act & Assert: Expect the getBasicUserInfo method to throw the error
        await expect(authAPI.getBasicUserInfo()).rejects.toThrow('Failed to fetch user info');
        expect(mockClient.getBasicUserInfo).toHaveBeenCalledTimes(1);
    });
});
