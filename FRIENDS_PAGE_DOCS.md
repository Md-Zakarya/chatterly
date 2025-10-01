# Friends Page Documentation

## Overview
The Friends page provides a comprehensive interface for managing friendships and friend requests in the application. It aligns with the backend API routes defined in `friendRoutes.js`.

## Features

### 1. **Friends List Tab**
- Displays all current friends
- Shows friend's avatar, display name, username, and online status
- Allows removing friends with confirmation
- Empty state when no friends exist

### 2. **Incoming Requests Tab**
- Shows pending friend requests received from other users
- Displays request timestamp with human-readable format (e.g., "2h ago")
- Actions: Accept or Decline requests
- Badge counter showing number of pending requests

### 3. **Outgoing Requests Tab**
- Shows friend requests you've sent that are still pending
- Displays when the request was sent
- Action: Cancel pending requests
- Badge counter showing number of outgoing requests

### 4. **Search Tab**
- Search for users by name or username
- Real-time search results
- Shows friendship status for each user:
  - "Add Friend" button for users you're not connected with
  - "Pending" label for users with pending requests
  - "Friends" label for existing friends
- Empty state guidance

## Components

### FriendCard
**Location:** `src/components/friends/FriendCard.jsx`

Reusable component for displaying user information with customizable actions.

**Props:**
- `user` (Object): User data (displayName, username, avatar, isOnline)
- `onAction` (Function): Primary action callback
- `onSecondaryAction` (Function): Secondary action callback (optional)
- `actionLabel` (string): Primary button label
- `secondaryActionLabel` (string): Secondary button label (optional)
- `loading` (boolean): Loading state for buttons
- `actionVariant` (string): Button variant ('primary', 'secondary', 'ghost')

**Usage:**
```jsx
<FriendCard
  user={friendData}
  actionLabel="Remove"
  actionVariant="secondary"
  onAction={handleRemoveFriend}
/>
```

### FriendRequestCard
**Location:** `src/components/friends/FriendRequestCard.jsx`

Specialized component for displaying friend requests with appropriate actions.

**Props:**
- `request` (Object): Request data (id, status, timestamp)
- `user` (Object): User data (fromUser for incoming, toUser for outgoing)
- `type` (string): 'incoming' or 'outgoing'
- `onAccept` (Function): Accept callback (incoming only)
- `onReject` (Function): Reject callback (incoming only)
- `onCancel` (Function): Cancel callback (outgoing only)

**Usage:**
```jsx
<FriendRequestCard
  request={requestData}
  user={requestData.fromUser}
  type="incoming"
  onAccept={handleAccept}
  onReject={handleReject}
/>
```

## API Integration

### Backend Endpoints Used
All endpoints are defined in `backend/routes/friendRoutes.js`:

1. `GET /api/friends/:userId` - Get friends list
2. `GET /api/friends/requests/received/:userId` - Get incoming requests
3. `GET /api/friends/requests/sent/:userId` - Get outgoing requests
4. `GET /api/friends/search` - Search users
5. `POST /api/friends/request` - Send friend request
6. `POST /api/friends/respond` - Respond to friend request (accept/reject)
7. `DELETE /api/friends/request/:requestId` - Cancel friend request
8. `DELETE /api/friends/:userId/:friendId` - Remove friend

### Service Functions
All API calls are abstracted in `src/services/friendService.js`:

- `getFriends(userId)`
- `getFriendRequests(userId)`
- `getSentFriendRequests(userId)`
- `searchUsers(query, userId)`
- `sendFriendRequest(fromUserId, toUserId)`
- `respondToFriendRequest(requestId, action)`
- `cancelFriendRequest(requestId)`
- `removeFriend(userId, friendId)`

## Styling

### Theme Alignment
The page follows the existing mono theme defined in `tailwind.config.js` and `index.css`:

- **Colors:** Uses CSS variables (--bg, --card, --fg, --muted, --border)
- **Components:** Uses existing utility classes (mono-page, mono-card, mono-btn)
- **Typography:** Uses font-display (Bricolage Grotesque) and font-mono (IBM Plex Mono)
- **Effects:** Consistent border styling, shadows, and transitions

### Responsive Design
- Tabs are horizontally scrollable on mobile if needed
- Content area scrolls independently
- Proper spacing and touch targets for mobile devices

## State Management

### Loading States
- Individual loading indicators for each tab
- Button loading states during actions
- Spinner displayed during API calls

### Error Handling
- Error messages displayed at the top of content area
- All API errors are caught and displayed to users
- Confirmation dialogs for destructive actions (remove friend, cancel request)

### Auto-refresh
- Data automatically refreshes when switching tabs
- Lists update after successful actions (accept, reject, cancel, remove)

## Navigation

### Route
- Path: `/friends`
- Protected with `ProtectedRoute` component
- Requires authentication

### Header Integration
The Header component includes a "Friends" button for easy navigation:
```jsx
<Button
  variant="secondary"
  onClick={() => navigate('/friends')}
>
  Friends
</Button>
```

## Best Practices

1. **Reusable Components:** FriendCard and FriendRequestCard can be used elsewhere
2. **Separation of Concerns:** UI logic separate from API logic
3. **Error Boundaries:** Proper error handling at each level
4. **Accessibility:** Semantic HTML, ARIA labels, keyboard navigation
5. **Performance:** Efficient re-renders, proper dependency arrays
6. **User Experience:** Loading states, empty states, confirmation dialogs

## Future Enhancements

Potential improvements:
- Real-time updates via WebSocket for new requests
- Pagination for large friend lists
- Advanced search filters
- Friend suggestions
- Mutual friends display
- Block/unblock functionality
