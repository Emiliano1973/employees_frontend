

export async function departmentService (url, token){
  

    const response = await fetch(url+`/api/services/departments`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+token,
          'access-control-allow-origin' : '*',
          'Content-type': 'application/json; charset=UTF-8',
          'Cache-Control': 'no-cache'
        }});


      if (!response.ok) {
        throw new Error('Error in loading department list');
      }
      const jsonData = await response.json();
      return jsonData;   
}