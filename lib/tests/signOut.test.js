// signOut.test.js
import AuthAPI from '../src/api'; // Adjust the path as necessary

// Mock functions
const mockSignOut = jest.fn();
const mockDispatch = jest.fn();

jest.mock('@asgardeo/auth-spa', () => ({
    AsgardeoSPAClient: {
        getInstance: () => ({
            signOut: mockSignOut,
        }),
    },
}));

describe('signOut()', () => {
    let auth;

    beforeEach(() => {
        auth = new AuthAPI();
        jest.clearAllMocks(); // Reset mocks before each test
    });

    it('should successfully sign out the user', async () => {
        // Mock successful sign-out response
        mockSignOut.mockResolvedValue(true);

        const state = { isAuthenticated: true };

        const callback = jest.fn();
        await auth.signOut(mockDispatch, state, callback);

        expect(mockSignOut).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith({
            isAuthenticated: false,
            isLoading: false,
        });
        expect(callback).toHaveBeenCalledWith(true);
    });

    it('should handle sign-out failure', async () => {
        // Mock sign-out failure
        const error = new Error('Sign-out failed');
        mockSignOut.mockRejectedValue(error);

        await expect(auth.signOut(mockDispatch, {})).rejects.toThrow('Sign-out failed');

        expect(mockSignOut).toHaveBeenCalledTimes(1);
        expect(mockDispatch).not.toHaveBeenCalled();
    });
});
