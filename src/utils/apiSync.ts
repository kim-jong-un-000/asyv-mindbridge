/**
 * Real-time Multi-Device Synchronization & Central API Service.
 * Ensures all connected computers, phones, and locations connect to the same central database,
 * receive real-time updates via WebSockets, and persist changes centrally.
 */

export interface RemoteSyncMessage {
  type: 'INIT_STATE' | 'REMOTE_ACTION' | 'PONG';
  action?: string;
  payload?: any;
  version?: number;
  timestamp?: string;
}

export type NetworkSyncStatus = 'connected' | 'syncing' | 'offline';

let activeWs: WebSocket | null = null;
let reconnectTimer: any = null;
let pingInterval: any = null;
let statusListeners: ((status: NetworkSyncStatus) => void)[] = [];
let messageListeners: ((msg: RemoteSyncMessage) => void)[] = [];
let currentStatus: NetworkSyncStatus = 'syncing';

function setStatus(status: NetworkSyncStatus) {
  if (currentStatus !== status) {
    currentStatus = status;
    statusListeners.forEach((fn) => fn(status));
  }
}

export function subscribeNetworkStatus(callback: (status: NetworkSyncStatus) => void): () => void {
  statusListeners.push(callback);
  callback(currentStatus);
  return () => {
    statusListeners = statusListeners.filter((cb) => cb !== callback);
  };
}

export function subscribeSyncMessages(callback: (msg: RemoteSyncMessage) => void): () => void {
  messageListeners.push(callback);
  return () => {
    messageListeners = messageListeners.filter((cb) => cb !== callback);
  };
}

// Fetch complete authoritative central database from server
export async function fetchCentralState(): Promise<any | null> {
  try {
    const res = await fetch('/api/state', { credentials: 'same-origin' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json && json.success && json.data) {
      return json.data;
    }
    return null;
  } catch (err) {
    console.warn('Network fetchCentralState fallback:', err);
    return null;
  }
}

// Mutate state centrally via REST API + WebSocket broadcast
export async function mutateCentralState(action: string, payload: any): Promise<boolean> {
  // 1. If WebSocket is connected, dispatch immediately
  if (activeWs && activeWs.readyState === WebSocket.OPEN) {
    try {
      activeWs.send(JSON.stringify({ type: 'MUTATE', action, payload }));
    } catch (e) {
      console.warn('WS send failed, falling back to HTTP:', e);
    }
  }

  // 2. Also send HTTP POST to guarantee persistence and handle responses
  try {
    const res = await fetch('/api/mutate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload })
    });
    const json = await res.json();
    return !!json.success;
  } catch (err) {
    console.error(`Mutation "${action}" failed:`, err);
    return false;
  }
}

// Initialize persistent WebSocket client
export function initWebSocketSync(
  onMessage: (msg: RemoteSyncMessage) => void,
  onStatusChange: (status: NetworkSyncStatus) => void
): () => void {
  messageListeners.push(onMessage);
  statusListeners.push(onStatusChange);

  function connect() {
    if (typeof window === 'undefined') return;

    if (activeWs) {
      try {
        activeWs.close();
      } catch {}
      activeWs = null;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    setStatus('syncing');

    try {
      const ws = new WebSocket(wsUrl);
      activeWs = ws;

      ws.onopen = () => {
        setStatus('connected');
        if (reconnectTimer) clearTimeout(reconnectTimer);

        // Start ping heartbeat
        if (pingInterval) clearInterval(pingInterval);
        pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'PING' }));
          }
        }, 20000);
      };

      ws.onmessage = (event) => {
        try {
          const data: RemoteSyncMessage = JSON.parse(event.data);
          messageListeners.forEach((fn) => fn(data));
        } catch (e) {
          console.error('Failed to parse WS message:', e);
        }
      };

      ws.onclose = () => {
        setStatus('offline');
        if (pingInterval) clearInterval(pingInterval);
        // Retry connection after 3 seconds
        reconnectTimer = setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        setStatus('offline');
        try {
          ws.close();
        } catch {}
      };
    } catch (err) {
      console.error('WebSocket connection error:', err);
      setStatus('offline');
      reconnectTimer = setTimeout(connect, 3000);
    }
  }

  connect();

  return () => {
    messageListeners = messageListeners.filter((fn) => fn !== onMessage);
    statusListeners = statusListeners.filter((fn) => fn !== onStatusChange);
    if (pingInterval) clearInterval(pingInterval);
    if (reconnectTimer) clearTimeout(reconnectTimer);
    if (activeWs) {
      try {
        activeWs.close();
      } catch {}
      activeWs = null;
    }
  };
}
