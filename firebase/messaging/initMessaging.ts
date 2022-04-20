import firebase from "../firebaseClient";
import localforage from "localforage";
//enables messaging
const enableMessaging = async () => {
  if (typeof window !== "undefined") {
    await import("firebase/messaging");
    if (firebase.messaging.isSupported()) {
      try {
        if ((await localforage.getItem("fcm_token")) !== null) {
          return false;
        }
        await Notification.requestPermission();
        console.log(firebase.apps);
        const token = await firebase.messaging().getToken({
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });
        localforage.setItem("fcm_token", token);
        console.log("fcm_token", token);
      } catch (error) {
        console.log(error);
        throw "Unknown error occurred";
      }
    } else {
      throw "Not Supported";
    }
  }
};

export const onMessageListener = async () => {
  if (typeof window !== "undefined") {
    await import("firebase/messaging");
    if (firebase.messaging.isSupported()) {
      return new Promise((resolve) => {
        firebase.messaging().onMessage((payload) => resolve(payload));
      });
    }
  }
};

export default enableMessaging;
