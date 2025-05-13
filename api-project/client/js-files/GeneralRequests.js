import  './refreshToken'; 
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';
import {refreshToken}from './refreshToken';
export const fetchData = async (typeOfItem, attribute, id = "", handleError) => {
  const url = `http://localhost:3000/${typeOfItem}/?${attribute}=${id}`;

  const makeRequest = async (token) => {
    return await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      credentials: 'include'
    });
  };

  try {
    let token = Cookies.get("accessToken");
    let response = await makeRequest(token);

    if (response.status === 401 || response.status === 403) {
      token = await refreshToken(); 
      response = await makeRequest(token);
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
