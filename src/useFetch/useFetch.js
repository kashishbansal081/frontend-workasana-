import {useState, useEffect} from "react";

const useFetch = (url, refreshTrigger) => {
  const [data, setData] = useState(null);

  useEffect(() => {

    const fetchData = () => {

    const token = localStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    fetch(url, { headers })
      .then((response) => {
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
      });

    };

    fetchData();
  }, [url, refreshTrigger]);

  return { data };
};

export default useFetch;
