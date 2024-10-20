jest.mock('@asgardeo/auth-spa');

// Import necessary dependencies
import AuthAPI from '../src/api';
// Mock the client used in signIn to control its behavior during tests
const mockClient = {
  signIn: jest.fn().mockResolvedValue(mockResponse),
  isAuthenticated: jest.fn(),
};

// Create mock implementations for dispatch and callback functions
const mockDispatch = jest.fn();
const mockCallback = jest.fn();

// Mock configuration objects and state for tests
const mockConfig = { clientId: 'abc', redirectUri: 'http://localhost' };
const mockState = { isAuthenticated: false, isLoading: true };
const mockResponse = {
  allowedScopes: ['openid', 'profile'],
  displayName: 'John Doe',
  email: 'john@example.com',
  sub: '1234',
  username: 'johndoe',
};

describe('signIn()', () => {
  let auth;
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks between tests
    auth = new AuthAPI(mockClient);
  });

  test('AuthAPI should have a client', () => {
    const auth = new AuthAPI(mockClient);
    expect(auth._client).toBeDefined(); // Should not be undefined
    });

  test('should authenticate and update state with valid authorization code', async () => {
    // Mock client methods to simulate a successful login
    mockClient.signIn.mockResolvedValue(mockResponse);
    mockClient.isAuthenticated.mockResolvedValue(true);

    // Call the signIn function
    const result = await auth.signIn(
      mockDispatch,
      mockState,
      mockConfig,
      'valid-auth-code',
      'session-state',
    );

    // Assertions
    expect(mockClient.signIn).toHaveBeenCalledWith(
      mockConfig,
      'valid-auth-code',
      'session-state',
      undefined,
      undefined
    );
    expect(mockClient.isAuthenticated).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith({
      ...mockState,
      allowedScopes: mockResponse.allowedScopes,
      displayName: mockResponse.displayName,
      email: mockResponse.email,
      isAuthenticated: true,
      isLoading: false,
      isSigningOut: false,
      sub: mockResponse.sub,
      username: mockResponse.username,
    });
    expect(result).toEqual(mockResponse);
  });

  test('should return error on invalid authorization code', async () => {
    // Mock client to simulate a failed login
    mockClient.signIn.mockRejectedValue(new Error('Invalid code'));

    await expect(
      auth.signIn(
        mockDispatch,
        mockState,
        mockConfig,
        'invalid-auth-code',
        'session-state'
      )
    ).rejects.toThrow('Invalid code');

    expect(mockClient.signIn).toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled(); // No state update on failure
  });

  test('should call callback with BasicUserInfo if provided', async () => {
    // Mock a successful login
    mockClient.signIn.mockResolvedValue(mockResponse);
    mockClient.isAuthenticated.mockResolvedValue(true);

    await auth.signIn(
      mockDispatch,
      mockState,
      mockConfig,
      'valid-auth-code',
      'session-state',
      undefined,
      mockCallback
    );

    expect(mockCallback).toHaveBeenCalledWith(mockResponse);
  });

  test('should handle network failure gracefully', async () => {
    // Mock client to simulate network failure
    mockClient.signIn.mockRejectedValue(new Error('Network error'));

    await expect(
      auth.signIn(
        mockDispatch,
        mockState,
        mockConfig,
        'valid-auth-code',
        'session-state'
      )
    ).rejects.toThrow('Network error');

    expect(mockClient.signIn).toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled(); // No state update on failure
  });
});
