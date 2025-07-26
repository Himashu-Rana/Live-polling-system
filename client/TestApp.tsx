export default function TestApp() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-foreground">
          Live Polling System
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          React app is working! Socket.io integration in progress...
        </p>
        <div className="space-y-4">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-2">System Status</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>React:</span>
                <span className="text-green-500">✓ Working</span>
              </div>
              <div className="flex justify-between">
                <span>Tailwind CSS:</span>
                <span className="text-green-500">✓ Working</span>
              </div>
              <div className="flex justify-between">
                <span>Socket.io:</span>
                <span className="text-yellow-500">⚠ Connecting...</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              alert('Button click working!');
            }}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Test Interaction
          </button>
        </div>
      </div>
    </div>
  );
}
