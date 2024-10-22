import AuthAPI from '../src/api'; // Adjust import if needed

describe('AuthAPI isAuthenticated()', () => {
    let auth;
    let mockIsAuthenticated;

    beforeEach(() => {
        // Create a mock client object
        const mockClient = {
            isAuthenticated: jest.fn(),
        };

        // Mock _client on the AuthAPI instance
        auth = new AuthAPI();
        auth._client = mockClient; // Manually assign mock client here

        // Mock the isAuthenticated method on the mock client
        mockIsAuthenticated = auth._client.isAuthenticated;
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return true when the user is authenticated', async () => {
        mockIsAuthenticated.mockResolvedValueOnce(true);

        const result = await auth.isAuthenticated();

        expect(result).toBe(true);
    });

    it('should return false when the user is not authenticated', async () => {
        mockIsAuthenticated.mockResolvedValueOnce(false);

        const result = await auth.isAuthenticated();

        expect(result).toBe(false);
    });

    it('should throw an error if isAuthenticated() fails', async () => {
        const errorMessage = 'Failed to check authentication';
        mockIsAuthenticated.mockRejectedValueOnce(new Error(errorMessage));

        await expect(auth.isAuthenticated()).rejects.toThrow(errorMessage);
    });
});
