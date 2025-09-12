const axios = require("axios");
const validateCoordinates = async ({ lat, long }) => {
  try {
    const res = await axios.get(`https://geocode.maps.co/reverse?lat=${lat}&lon=${long}&api_key=${process.env.GEOCODE_API_KEY}`);
    if (res && res.data) {
      return {
        valid: true,
        address: res.data.display_name || null,
        city: res.data.address.city || null,
        country: res.data.address.country || null
      };
    }
    return { valid: false };
  } catch (error) {
    console.error("Geocoding error:", error);
    return { valid: false, error: error.message };
  }
};

module.exports = { validateCoordinates };
