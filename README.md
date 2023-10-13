---------------------------------------------A Web Scraping API made with Node.js------------------------------------------------------

ENDPOINTS: 
The API has only one endpoint("/scraper") which is responsible of retrieving the scraped information when the proper URL is parsed as a request parameter. The user information(URL) can be parsed to the HTML form to be gathered by API endpoint and after it complete the scraping logic, the result will be displayed on "front-end".

How to run the application:
DISCLAIMER: THE "EXPLICIT" INFORMATION NOT FOR PROFESSIONALS, THEY KNOW EXACTLY WHAT THEY ARE DOING! 

First of all the application will need some packages that can be installed from package.json (after you have the application locally) with command: "npm i" in terminal(you need to be in the director where package.json is located).
After the packages are installed successfully you can run command: "node server.js" in terminal(make sure you are in the right director) and the application will be available browser at "localhost:5225" (make sure the port 5225 is not occupied, i made it 5225 in hope to not be). You can also check the api endpoint("localhost:5225/scraper/website-domain.vercel.app/") using Postman.
