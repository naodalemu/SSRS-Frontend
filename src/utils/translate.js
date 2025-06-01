import axios from "axios";

const GOOGLE_TRANSLATE_API_URL = "https://translation.googleapis.com/language/translate/v2";
const API_KEY = "YOUR_GOOGLE_API_KEY"; // Replace with your actual API key

export const translateText = async (text, targetLanguage) => {
  try {
    const response = await axios.post(GOOGLE_TRANSLATE_API_URL, {
      q: text,
      target: targetLanguage,
      key: API_KEY,
    });

    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error("Error translating text:", error);
    return text; // Fallback to original text if translation fails
  }
};