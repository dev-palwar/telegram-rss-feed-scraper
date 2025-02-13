const axios = require("axios");
const xml2js = require("xml2js");

// URL of the RSS feed
const rssFeedUrl = "https://rsshub.app/telegram/channel/sportbets365com";

// Function to fetch and convert XML to JSON
async function convertXmlToJson() {
  try {
    // Fetch the XML data
    const response = await axios.get(rssFeedUrl);
    const xmlData = response.data;

    // Parse XML to JSON
    const parser = new xml2js.Parser({
      explicitArray: false,
      ignoreAttrs: true,
    });
    parser.parseString(xmlData, (err, result) => {
      if (err) {
        console.error("Error parsing XML:", err);
      } else {
        // Output the JSON result
        // console.log(JSON.stringify(result, null, 2));
      }
    });
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
  }
}

// Run the function
convertXmlToJson();
