import React from "react";

import round from "lodash/round";

import { useInterval } from "../hooks/useInterval";
import { Geolocation } from "../types";

type Props = {
  children: React.ReactNode;
};
const DELAY = 5000;
const DEFAULT_GEOLOCATION = {
  latitude: 51.505,
  longitude: -0.09,
};

export const GeolocationContext =
  React.createContext<Geolocation>(DEFAULT_GEOLOCATION);

const GeolocationProvider: React.FC<Props> = ({ children }) => {
  const [geolocation, setGeolocation] =
    React.useState<Geolocation>(DEFAULT_GEOLOCATION);

  const getGeolocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setGeolocation({
        latitude: round(latitude, 3),
        longitude: round(longitude, 3),
      });
    });
  };

  useInterval(getGeolocation, DELAY);

  return (
    <GeolocationContext.Provider
      value={React.useMemo(() => geolocation, [JSON.stringify(geolocation)])}
    >
      {children}
    </GeolocationContext.Provider>
  );
};

export default GeolocationProvider;

// const sendNotification = (fcm_token: string | null) =>
//   sleep(5000).then(() =>
//     fetch("https://fcm.googleapis.com/fcm/send", {
//       method: "POST",
//       headers: {
//         Authorization: `key=${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         notification: {
//           title: "Fireabse",
//           body: "Firebase is awesome",
//         },
//         to: fcm_token,
//       }),
//     })
//   );

// const withinRadius = (
//     point: { latitude: number; longitude: number },
//     interest: { latitude: number; longitude: number },
//     kms: number
//   ) => {
//     let R = 6371;
//     let deg2rad = (degrees: number) => {
//       return degrees * (Math.PI / 180);
//     };

//     let dLat = deg2rad(interest.latitude - point.latitude);
//     let dLon = deg2rad(interest.longitude - point.longitude);

//     let a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(deg2rad(point.latitude)) *
//         Math.cos(deg2rad(interest.latitude)) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     let c = 2 * Math.asin(Math.sqrt(a));
//     let d = R * c;

//     return d <= kms;
//   };

//   const sleep = (ms: number) => {
//     return new Promise((resolve) => setTimeout(resolve, ms));
//   };

// React.useEffect(() => {
//     if (
//       currentPosition &&
//       !notified &&
//       withinRadius(
//         currentPosition,
//         { latitude: 50.0671743, longitude: 20.0263019 },
//         1
//       )
//     ) {
//       setNotified(true);
//       localforage
//         .getItem<string>("fcm_token")
//         .then((fcm_token) => alert(fcm_token));
//     }
//   }, [currentPosition, notified]);
