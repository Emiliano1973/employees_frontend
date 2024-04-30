
export async function titleService (url, token){
  

    const response = await fetch(url+`/api/services/titles`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+token,
          'access-control-allow-origin' : '*',
          'Content-type': 'application/json; charset=UTF-8',
          'Cache-Control': 'no-cache'
        }});

      if (!response.ok) {
        throw new Error('Error in loading title list');
      }
      const jsonData = await response.json();
      return jsonData;   
}