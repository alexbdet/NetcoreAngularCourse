using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.SignalR
{
    // Not scalable (shared resource), wouldn't work on a multi-server environment, will later be updated to use the database
    public class PresenceTracker
    {
        private static readonly Dictionary<string, List<string>> OnlineUsers = new Dictionary<string, List<string>>();

        public Task<bool> UserConnected(string username, string connectionId)
        {
            bool isOnline = false;

            lock (OnlineUsers)
            {
                if (OnlineUsers.ContainsKey(username))
                    OnlineUsers[username].Add(connectionId);
                else
                {
                    isOnline = true;
                    OnlineUsers.Add(username, new List<string> { connectionId });
                }
            }

            return Task.FromResult(isOnline);
        }

        public Task<bool> UserDisconnected(string username, string connectionId)
        {
            bool isOffline = false;

            lock (OnlineUsers)
            {
                if (!OnlineUsers.ContainsKey(username)) return Task.FromResult(isOffline);

                OnlineUsers[username].Remove(connectionId);
                if (OnlineUsers[username].Count == 0)
                {
                    isOffline = true;
                    OnlineUsers.Remove(username);
                }
            }

            return Task.FromResult(isOffline);
        }

        public Task<string[]> GetOnlineUsers()
        {
            string[] ol;

            lock (OnlineUsers)
            {
                ol = OnlineUsers.OrderBy(k => k.Key).Select(k => k.Key).ToArray();
            }

            return Task.FromResult(ol);
        }

        public Task<List<string>> GetConnectionsForUser(string username)
        {
            List<string> connectionIds;

            lock (OnlineUsers)
            {
                connectionIds = OnlineUsers.GetValueOrDefault(username);
            }

            return Task.FromResult(connectionIds);
        }
    }
}