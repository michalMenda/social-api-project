// // URL for the TypeScript backend (replace with the actual URL of your TypeScript API)
// const typeScriptApiUrls = {
//     comments: 'https://jsonplaceholder.typicode.com/comments',
//     users: 'https://jsonplaceholder.typicode.com/users',
//     todos: 'https://jsonplaceholder.typicode.com/todos',
//     photos: 'https://jsonplaceholder.typicode.com/photos',
//     posts: 'https://jsonplaceholder.typicode.com/posts',
//     albums: 'https://jsonplaceholder.typicode.com/albums',
//   };
  
//   // URL for the local JSON server (replace with your local server URL)
//   const localApiUrls = {
//     comments: 'http://localhost:3000/comments',
//     users: 'http://localhost:3000/users',
//     todos: 'http://localhost:3000/todos',
//     photos: 'http://localhost:3000/photos',
//     posts: 'http://localhost:3000/posts',
//     albums: 'http://localhost:3000/albums',
//   };
  
//   // Function to fetch data from TypeScript backend and post it to the local JSON server
//   async function transferDataToLocalDatabase() {
//     try {
//       // Step 1: Loop over all the data types
//       for (const dataType of Object.keys(typeScriptApiUrls)) {
//         // Fetch data from the TypeScript backend
//         const response = await fetch(typeScriptApiUrls[dataType]);
//         if (!response.ok) {
//           throw new Error(`Failed to fetch ${dataType} data from TypeScript backend: ${response.statusText}`);
//         }
//         const data = await response.json();
  
//         // Step 2: Send the fetched data to the local JSON server
//         const postPromises = data.map(async (item) => {
//           const postResponse = await fetch(localApiUrls[dataType], {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(item), // Assuming each item matches the local database format
//           });
  
//           if (!postResponse.ok) {
//             console.error(`Failed to post ${dataType} item to local database: ${postResponse.statusText}`);
//           } else {
//             console.log(`Successfully posted ${dataType} item:`, item);
//           }
//         });
  
//         // Wait for all posts for this data type to finish
//         await Promise.all(postPromises);
//         console.log(`${dataType} data has been successfully transferred to the local database!`);
//       }
  
//       console.log('All data has been successfully transferred to the local database!');
//     } catch (error) {
//       console.error('Error during data transfer:', error);
//     }
//   }
  
//   // Run the function to transfer the data
//   transferDataToLocalDatabase();
  