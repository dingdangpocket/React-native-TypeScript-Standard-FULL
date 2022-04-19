const unsupported = () => {
  throw new Error('react-native-view-shot not be supported in web page');
};

export const captureRef = unsupported;

export const releaseCapture = unsupported;

export const captureScreen = unsupported;

export const ViewShot = unsupported;
