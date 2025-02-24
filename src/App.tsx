import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

function App() {
  const { loginWithRedirect, user, logout, getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState(null);

  
  const fetchProtectedData = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch("http://localhost:8000/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      setData(responseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <button onClick={() => loginWithRedirect()}>Log In</button>
      <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
        Log Out
      </button>
      <button onClick={fetchProtectedData} disabled={!user}>
        Fetch Protected Data
      </button>
      {data && <pre>{JSON.stringify(data)}</pre>}
    </>
  );
}

export default App;
