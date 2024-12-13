/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Import necessary modules
import AuthAPI from '../src/api'; // Adjust the path as needed
import { AsgardeoSPAClient } from '@asgardeo/auth-spa'; // Adjust the path as needed

// Mock the AsgardeoSPAClient module
jest.mock('@asgardeo/auth-spa', () => ({
    AsgardeoSPAClient: {
        getInstance: jest.fn(), // Mock the getInstance method
    },
}));

describe('AuthAPI refreshAccessToken()', () => {
    let authAPI;
    let mockClient;

    beforeEach(() => {
        // Step 1: Create a mock client with the refreshAccessToken method
        mockClient = {
            refreshAccessToken: jest.fn(), // Mock refreshAccessToken method
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

    it('should refresh the access token successfully', async () => {
        // Arrange: Mock the resolved value for refreshAccessToken
        const mockAccessToken = {
            access_token: 'newAccessToken',
            expires_in: 3600,
        };
        mockClient.refreshAccessToken.mockResolvedValue(mockAccessToken);

        // Act: Call the refreshAccessToken method
        const result = await authAPI.refreshAccessToken();

        // Assert: Check if the result is the expected mockAccessToken
        expect(result).toEqual(mockAccessToken);
        expect(mockClient.refreshAccessToken).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when refreshAccessToken fails', async () => {
        // Arrange: Mock a rejected promise to simulate an error
        const mockError = new Error('Failed to refresh access token');
        mockClient.refreshAccessToken.mockRejectedValue(mockError);

        // Act & Assert: Expect the refreshAccessToken method to throw the error
        await expect(authAPI.refreshAccessToken()).rejects.toThrow('Failed to refresh access token');
        expect(mockClient.refreshAccessToken).toHaveBeenCalledTimes(1);
    });
});
