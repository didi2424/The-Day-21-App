import { useState, useEffect } from "react"; // Import useState and useEffect

const Stock = () => {
  // State to store the inventory list
  const [inventory, setInventory] = useState([]);

  // State to handle loading state and error state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch inventory list when the component mounts
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        // Make the GET request to the API
        const response = await fetch('/api/inventory');
        
        if (!response.ok) {
          throw new Error('Failed to fetch inventory');
        }
    
        const data = await response.json();
        console.log(data);  // Log the response to confirm it's structured correctly
    
        // Access 'inventory' from the response object and set the state
        setInventory(data.inventory);  // Correctly accessing the inventory array
    
      } catch (error) {
        setError(error.message); // Set error message if something goes wrong
      } finally {
        setLoading(false); // Set loading to false after the fetch is complete
      }
    };

    fetchInventory(); // Call the function to fetch the inventory
  }, []); // Empty dependency array to run this effect only once when component mounts

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while data is being fetched
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message if fetching failed
  }

  return (
    <div>
      <div className="flex flex-1 justify-between items-center">
        <h2 className="text-2xl font-bold">Stock List</h2>
      </div>


      {/* Display the inventory list */}
      <div className="mt-4">
        {inventory.length > 0 ? (
          <ul>
            {inventory.map((item) => (
              <li key={item.id} className="mb-2">
                <div className="flex flex-col p-2 border border-gray-300 rounded-md">
                  <div className="font-bold">{item.name}</div>
                  <div>Price: {item.price}</div>
                  <div>Category: {item.category}</div>
                  <div>Stock: {item.stock}</div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No inventory items available</p>
        )}
      </div>
    </div>
  );
};

export default Stock;
