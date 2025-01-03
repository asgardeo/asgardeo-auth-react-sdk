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
