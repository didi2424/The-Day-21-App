export const updateInventory = async (id, updatedData) => {
    const response = await fetch(`/api/inventory/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
  
    if (!response.ok) throw new Error("Failed to update inventory");
  
    return response.json();
  };