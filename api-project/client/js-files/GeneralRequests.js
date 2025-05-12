export const fetchData = async (typeOfItem, attribute, id = "", handleError) => {
    try {
      let token = localStorage.getItem('accessToken');
  
      let response = await fetch(`http://localhost:3000/${typeOfItem}/?${attribute}=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        credentials: 'include' // מאפשר שליחת cookie ל-refresh
      });
  
      // אם הטוקן פג תוקף → בקשת refresh
      if (response.status === 401 || response.status === 403) {
        const refreshRes = await fetch('http://localhost:3000/refresh', {
          method: 'POST',
          credentials: 'include'
        });
  
        if (!refreshRes.ok) throw new Error('Refresh failed');
  
        const { accessToken } = await refreshRes.json();
        localStorage.setItem('accessToken', accessToken);
  
        // שליחה מחדש של הבקשה המקורית עם הטוקן החדש
        response = await fetch(`http://localhost:3000/${typeOfItem}/?${attribute}=${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          credentials: 'include'
        });
      }
  
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
      handleError("getError", error);
    }
  };
  