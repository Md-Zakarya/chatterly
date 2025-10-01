import FriendCard from '../components/friends/FriendCard';
import FriendRequestCard from '../components/friends/FriendRequestCard';
import SearchInput from '../components/ui/SearchInput';
import { useFriendsViewModel } from '../viewModels/useFriendsViewModel';

const TABS = {
  FRIENDS: 'friends',
  INCOMING: 'incoming',
  OUTGOING: 'outgoing',
  SEARCH: 'search',
};

const FriendsPage = () => {
  const {
    activeTab,
    loading,
    error,
    friends,
    incomingRequests,
    outgoingRequests,
    searchResults,
    searchQuery,
    setActiveTab,
    handleSearch,
    handleRemoveFriend,
    handleAcceptRequest,
    handleRejectRequest,
    handleCancelRequest,
    handleSendRequest,
    isActionLoading,
  } = useFriendsViewModel();

  return (
    <div className="mono-page flex h-full flex-col overflow-hidden">
      {/* Centered Container with max width */}
      <div className="mx-auto w-full max-w-5xl">
        {/* Header */}
        <div className="border-b border-[var(--border)] bg-[var(--card)] px-6 py-4">
          <h1 className="text-2xl font-bold text-[var(--fg)]">Friends</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Manage your friends and friend requests
          </p>
        </div>

      {/* Tabs */}
      <div className="border-b border-[var(--border)] bg-[var(--card)]">
        <div className="flex gap-1 px-6">
          <TabButton
            active={activeTab === TABS.FRIENDS}
            onClick={() => setActiveTab(TABS.FRIENDS)}
            count={friends.length}
          >
            Friends
          </TabButton>
          <TabButton
            active={activeTab === TABS.INCOMING}
            onClick={() => setActiveTab(TABS.INCOMING)}
            count={incomingRequests.length}
          >
            Incoming
          </TabButton>
          <TabButton
            active={activeTab === TABS.OUTGOING}
            onClick={() => setActiveTab(TABS.OUTGOING)}
            count={outgoingRequests.length}
          >
            Outgoing
          </TabButton>
          <TabButton
            active={activeTab === TABS.SEARCH}
            onClick={() => setActiveTab(TABS.SEARCH)}
          >
            Search
          </TabButton>
        </div>
      </div>

      {/* Search Bar (only visible in search tab) */}
      {activeTab === TABS.SEARCH && (
        <div className="border-b border-[var(--border)] bg-[var(--card)] px-6 py-4">
          <SearchInput
            placeholder="Search users by name or username..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-white"></div>
          </div>
        ) : (
          <div className="space-y-3">
              {activeTab === TABS.FRIENDS && (
                <>
                  {friends.length === 0 ? (
                    <EmptyState message="No friends yet. Start by searching for users!" />
                  ) : (
                    friends.map((friend) => (
                      <FriendCard
                        key={friend._id}
                        user={friend}
                        actionLabel="Remove"
                        actionVariant="secondary"
                        onAction={handleRemoveFriend}
                        loading={isActionLoading(friend._id)}
                      />
                    ))
                  )}
                </>
              )}            {activeTab === TABS.INCOMING && (
              <>
                {incomingRequests.length === 0 ? (
                  <EmptyState message="No incoming friend requests" />
                ) : (
                  incomingRequests.map((request) => (
                    <FriendRequestCard
                      key={request._id}
                      request={request}
                      user={request.fromUser}
                      type="incoming"
                      onAccept={handleAcceptRequest}
                      onReject={handleRejectRequest}
                      loading={isActionLoading(request._id)}
                    />
                  ))
                )}
              </>
            )}

            {activeTab === TABS.OUTGOING && (
              <>
                {outgoingRequests.length === 0 ? (
                  <EmptyState message="No outgoing friend requests" />
                ) : (
                  outgoingRequests.map((request) => (
                    <FriendRequestCard
                      key={request._id}
                      request={request}
                      user={request.toUser}
                      type="outgoing"
                      onCancel={handleCancelRequest}
                      loading={isActionLoading(request._id)}
                    />
                  ))
                )}
              </>
            )}

            {activeTab === TABS.SEARCH && (
              <>
                {!searchQuery.trim() ? (
                  <EmptyState message="Enter a name or username to search" />
                ) : searchResults.length === 0 ? (
                  <EmptyState message="No users found" />
                ) : (
                  searchResults.map((searchUser) => {
                    const isFriend = searchUser.friendshipStatus === 'friends';
                    const isPending = searchUser.friendshipStatus === 'pending';
                    const canAdd = searchUser.friendshipStatus === 'none';

                    return (
                        
                      <FriendCard
                        key={searchUser._id}
                        user={searchUser}
                        actionLabel={
                          isFriend
                            ? 'Friends'
                            : isPending
                            ? 'Pending'
                            : 'Add Friend'
                        }
                        actionVariant={
                          isFriend || isPending ? 'secondary' : 'primary'
                        }
                        onAction={canAdd ? handleSendRequest : undefined}
                        loading={isActionLoading(searchUser._id)}
                        disabled={!canAdd}
                      />
                    );
                  })
                )}
              </>
            )}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

// Tab Button Component
const TabButton = ({ children, active, onClick, count }) => {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-3 text-sm font-medium transition ${
        active
          ? 'text-[var(--fg)] border-b-2 border-white'
          : 'text-[var(--muted)] hover:text-[var(--fg)]'
      }`}
    >
      {children}
      {count !== undefined && count > 0 && (
        <span
          className={`ml-2 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold ${
            active
              ? 'bg-white text-black'
              : 'bg-[var(--border)] text-[var(--muted)]'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};

// Empty State Component
const EmptyState = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-[var(--border)]">
        <svg
          className="h-8 w-8 text-[var(--muted)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </div>
      <p className="text-sm text-[var(--muted)]">{message}</p>
    </div>
  );
};

export default FriendsPage;
