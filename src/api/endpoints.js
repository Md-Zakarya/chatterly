export const BASE_URL = 'http://localhost:3001'; // Your backend URL

export const ENDPOINTS = { 

    DATA: `${BASE_URL}/api/data`,
    WORKING: `${BASE_URL}/api/working`,

    REGISTER: `${BASE_URL}/api/auth/register`,
    LOGIN: `${BASE_URL}/api/auth/login`,

    // Friend endpoints
    FRIENDS: {
        SEARCH: `${BASE_URL}/api/friends/search`,
        REQUEST: `${BASE_URL}/api/friends/request`,
        RESPOND: `${BASE_URL}/api/friends/respond`,
        GET_FRIENDS: (userId) => `${BASE_URL}/api/friends/${userId}`,
        REMOVE_FRIEND: (userId, friendId) => `${BASE_URL}/api/friends/${userId}/${friendId}`,
        GET_REQUESTS_RECEIVED: (userId) => `${BASE_URL}/api/friends/requests/received/${userId}`,
        GET_REQUESTS_SENT: (userId) => `${BASE_URL}/api/friends/requests/sent/${userId}`,
        GET_STATUS: (userId, targetUserId) => `${BASE_URL}/api/friends/status/${userId}/${targetUserId}`,
        CANCEL_REQUEST: (requestId) => `${BASE_URL}/api/friends/request/${requestId}`,
    }

}