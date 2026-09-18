/** @type {import('@capacitor/cli').CapacitorConfig} */
const config = {
  appId: 'com.ems.android',
  appName: 'EMS Android',
  webDir: 'build',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 5000,
      launchAutoHide: true,
      backgroundColor: "#050814",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

module.exports = config;
