export default function OfflinePage() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>No Internet Connection</h1>
      <p>Please check your network and try again.</p>
    </div>
  );
}