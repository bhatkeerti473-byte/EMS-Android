// Base API URL configuration for Web & Mobile (Android / iOS)
// When running on an Android emulator or device, localhost points to the phone itself.
// Set REACT_APP_API_URL in .env to target your PC's local Wi-Fi IP (e.g., http://192.168.1.100:5000) or a production server.

const getApiBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Check if running inside Capacitor native Android app
  if (typeof window !== 'undefined' && window.Capacitor && window.Capacitor.getPlatform && window.Capacitor.getPlatform() === 'android') {
    // 10.0.2.2 is the Android Emulator alias to localhost on host PC
    return 'http://10.0.2.2:5000';
  }

  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiBaseUrl();
export default API_BASE_URL;
