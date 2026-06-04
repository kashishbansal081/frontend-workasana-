import { useState, useEffect } from "react";

const useFetch = (url, refreshTrigger) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      fetch(url, { headers })
        .then((response) => {
          if (response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
            return null;
          }
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((result) => {
          setData(result);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        }).finally(() => {
          setLoading(false);
        });
    };

    fetchData();
  }, [url, refreshTrigger]);

  return { data, loading };
};

export default useFetch;
