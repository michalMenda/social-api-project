export const fetchData = async (typeOfItem, attribute,id = "", handleError) => {
  try {
      const response = await fetch(`http://localhost:3000/${typeOfItem}/?${attribute}=${id}`);
      if (!response.ok) {
          throw new Error("Network response was not ok");
      }
      const result = await response.json();
      if (result.length > 0) {
          return result;
      } else {
          throw new Error("No user found with that ID");
      }
  } catch (error) {
     handleError("getError",error)
  }
};
