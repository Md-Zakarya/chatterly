# Friends Page - MVVM Architecture Documentation

## Overview
The Friends page has been refactored to follow the **MVVM (Model-View-ViewModel)** architecture pattern, providing better separation of concerns, testability, and maintainability.

## Architecture Structure

```
src/
├── pages/
│   └── FriendsPage.jsx           # View Layer - UI Components
├── viewModels/
│   └── useFriendsViewModel.js    # ViewModel Layer - Business Logic
├── services/
│   └── friendService.js          # Model Layer - Data Operations
├── components/
│   └── friends/
│       ├── FriendCard.jsx        # Reusable UI Component
│       └── FriendRequestCard.jsx # Reusable UI Component
└── api/
    └── endpoints.js              # API Endpoint Definitions
```

## Layer Responsibilities

### 1. Model Layer (`friendService.js`)
**Responsibility:** Data operations and API communication

**Functions:**
- `getFriends(userId)` - Fetch user's friends list
- `getFriendRequests(userId)` - Fetch incoming requests
- `getSentFriendRequests(userId)` - Fetch outgoing requests
- `searchUsers(query, userId)` - Search for users
- `sendFriendRequest(fromUserId, toUserId)` - Send friend request
- `respondToFriendRequest(requestId, action)` - Accept/reject request
- `cancelFriendRequest(requestId)` - Cancel outgoing request
- `removeFriend(userId, friendId)` - Remove friend

**Key Features:**
- Error handling with try-catch
- Consistent response transformation
- Token-based authentication via axiosInstance

### 2. ViewModel Layer (`useFriendsViewModel.js`)
**Responsibility:** Business logic, state management, and coordination

**State Management:**
```javascript
{
  // UI State
  activeTab: string,
  loading: boolean,
  error: string | null,
  actionLoading: string | null, // ID of item being acted upon
  
  // Data State
  friends: Array,
  incomingRequests: Array,
  outgoingRequests: Array,
  searchResults: Array,
  searchQuery: string
}
```

**Exposed Methods:**
- `setActiveTab(tab)` - Switch between tabs
- `handleSearch(query)` - Search users with debouncing
- `handleRemoveFriend(friend)` - Remove friend with confirmation
- `handleAcceptRequest(request)` - Accept friend request
- `handleRejectRequest(request)` - Reject friend request
- `handleCancelRequest(request)` - Cancel outgoing request
- `handleSendRequest(targetUser)` - Send friend request
- `isActionLoading(id)` - Check if specific action is loading

**Key Features:**
- `useCallback` for memoized functions
- Automatic data loading based on active tab
- Granular loading states for better UX
- Auto-dismiss errors after 5 seconds
- Optimistic UI updates for friend requests

### 3. View Layer (`FriendsPage.jsx`)
**Responsibility:** UI rendering and user interactions

**Structure:**
- Constrained width container (`max-w-3xl`) for better readability
- Tab navigation (Friends, Incoming, Outgoing, Search)
- Conditional search bar
- Dynamic content rendering
- Empty states for better UX

**Key Features:**
- Pure presentation logic
- No direct API calls
- All business logic delegated to ViewModel
- Responsive design with Tailwind CSS
- Accessible markup with proper ARIA labels

## Component Details

### FriendCard Component
**Purpose:** Display user/friend information with action buttons

**Props:**
```javascript
{
  user: Object,              // User data
  onAction: Function,        // Primary action callback
  onSecondaryAction: Function, // Optional secondary action
  actionLabel: string,       // Primary button text
  secondaryActionLabel: string, // Secondary button text
  loading: boolean,          // Loading state
  actionVariant: string,     // Button style variant
  disabled: boolean          // Disable interactions
}
```

**Use Cases:**
- Display friends list with "Remove" button
- Display search results with "Add Friend" button
- Display users with "Pending" or "Friends" status

### FriendRequestCard Component
**Purpose:** Display friend requests with accept/reject/cancel actions

**Props:**
```javascript
{
  request: Object,           // Request metadata
  user: Object,              // User data
  type: 'incoming' | 'outgoing', // Request type
  onAccept: Function,        // Accept callback (incoming)
  onReject: Function,        // Reject callback (incoming)
  onCancel: Function,        // Cancel callback (outgoing)
  loading: boolean           // External loading state
}
```

**Features:**
- Time formatting (e.g., "2h ago", "Just now")
- Different actions based on request type
- Internal and external loading state support

## Key Features

### 1. Add Friend Functionality
**Location:** Search tab in FriendsPage

**Flow:**
1. User searches for other users
2. System shows friendship status:
   - `none` → "Add Friend" button (primary, enabled)
   - `pending` → "Pending" button (secondary, disabled)
   - `friends` → "Friends" button (secondary, disabled)
3. User clicks "Add Friend"
4. System sends friend request via API
5. UI updates status to "Pending" optimistically
6. Search results refresh after 500ms

**API Endpoint:**
```
POST /api/friends/request
Body: { fromUserId, toUserId }
```

### 2. Constrained Width Design
**Implementation:**
```jsx
<div className="mx-auto w-full max-w-3xl">
  {/* All content */}
</div>
```

**Benefits:**
- Better readability on large screens
- Centered content layout
- Consistent with modern design patterns
- Maintains responsive behavior

### 3. Granular Loading States
**Implementation:**
```javascript
actionLoading: string | null  // Stores ID of loading item
isActionLoading: (id) => actionLoading === id
```

**Benefits:**
- Only disable the specific button being clicked
- Other items remain interactive
- Better user experience
- Visual feedback for specific actions

### 4. Error Handling
**Strategy:**
- Try-catch blocks in ViewModel
- Error state displayed at top of content
- Auto-dismiss after 5 seconds
- Non-blocking error messages

## Best Practices Implemented

### 1. Separation of Concerns
✅ **View** - Only UI and user interactions  
✅ **ViewModel** - Business logic and state  
✅ **Model** - Data operations and API calls  

### 2. Reusability
✅ Shared components (`FriendCard`, `FriendRequestCard`)  
✅ Custom hooks (`useFriendsViewModel`)  
✅ Utility functions (time formatting)  

### 3. Performance
✅ `useCallback` for function memoization  
✅ Optimistic UI updates  
✅ Debounced search (via ViewModel)  

### 4. User Experience
✅ Loading states for all actions  
✅ Error messages with auto-dismiss  
✅ Confirmation dialogs for destructive actions  
✅ Empty states with helpful messages  
✅ Badge counters on tabs  

### 5. Accessibility
✅ Semantic HTML elements  
✅ Proper ARIA labels  
✅ Keyboard navigation support  
✅ Focus management  

## Testing Strategy

### ViewModel Testing
```javascript
// Test state changes
test('should update friends list on loadFriends', async () => {
  const { result } = renderHook(() => useFriendsViewModel());
  await act(async () => {
    await result.current.loadFriends();
  });
  expect(result.current.friends).toBeDefined();
});

// Test action handlers
test('should send friend request and update status', async () => {
  const { result } = renderHook(() => useFriendsViewModel());
  await act(async () => {
    await result.current.handleSendRequest({ _id: '123' });
  });
  expect(result.current.error).toBeNull();
});
```

### Component Testing
```javascript
// Test UI rendering
test('renders FriendCard with correct props', () => {
  render(<FriendCard user={mockUser} actionLabel="Add Friend" />);
  expect(screen.getByText('Add Friend')).toBeInTheDocument();
});

// Test user interactions
test('calls onAction when button clicked', () => {
  const mockAction = jest.fn();
  render(<FriendCard user={mockUser} onAction={mockAction} />);
  fireEvent.click(screen.getByRole('button'));
  expect(mockAction).toHaveBeenCalledWith(mockUser);
});
```

## Future Enhancements

1. **WebSocket Integration**
   - Real-time friend request notifications
   - Live status updates

2. **Pagination**
   - Load more friends on scroll
   - Paginated search results

3. **Advanced Search**
   - Filter by online status
   - Filter by mutual friends

4. **Bulk Actions**
   - Select multiple requests
   - Accept/reject multiple at once

5. **Friend Suggestions**
   - Mutual friends algorithm
   - Interest-based suggestions

6. **Analytics**
   - Track friendship patterns
   - Popular connection times

## Migration Notes

### Before (Old Architecture)
- All logic in single component file (400+ lines)
- Direct API calls from component
- Mixed concerns (UI + logic + data)
- Difficult to test
- Hard to maintain

### After (MVVM Architecture)
- ViewModel: 230 lines (logic only)
- View: 190 lines (UI only)
- Services: 123 lines (data only)
- Clear separation of concerns
- Easily testable
- Maintainable and scalable

## Conclusion

The refactored Friends page now follows industry-standard MVVM architecture, providing:
- ✅ Better code organization
- ✅ Enhanced testability
- ✅ Improved maintainability
- ✅ Cleaner separation of concerns
- ✅ Better user experience
- ✅ Scalable codebase

This architecture can be replicated for other features in the application for consistency and maintainability.
