import { Image } from "expo-image";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Platform, StyleSheet } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  address?: string;
}

export default function HomeScreen() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      setLocationError(null);

      // Request permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("Permission to access location was denied");
        setLocationLoading(false);
        return;
      }

      // Get current position
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const locationData: LocationData = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy,
      };

      // Try to get address from coordinates
      try {
        const addressResponse = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        if (addressResponse.length > 0) {
          const addr = addressResponse[0];
          const addressString = [
            addr.name,
            addr.street,
            addr.city,
            addr.region,
            addr.country,
          ]
            .filter(Boolean)
            .join(", ");
          locationData.address = addressString;
        }
      } catch (addressError) {
        console.log("Could not get address:", addressError);
      }

      setLocation(locationData);
    } catch (error) {
      setLocationError("Error getting location: " + (error as Error).message);
    } finally {
      setLocationLoading(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome! Joe</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">📍 Your Location</ThemedText>
        {locationLoading ? (
          <ThemedText>Getting your location...</ThemedText>
        ) : locationError ? (
          <ThemedText style={styles.errorText}>{locationError}</ThemedText>
        ) : location ? (
          <ThemedView style={styles.locationContainer}>
            <ThemedText>
              <ThemedText type="defaultSemiBold">Coordinates:</ThemedText>{" "}
              {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </ThemedText>
            {location.accuracy && (
              <ThemedText>
                <ThemedText type="defaultSemiBold">Accuracy:</ThemedText> ±
                {Math.round(location.accuracy)}m
              </ThemedText>
            )}
            {location.address && (
              <ThemedText>
                <ThemedText type="defaultSemiBold">Address:</ThemedText>{" "}
                {location.address}
              </ThemedText>
            )}
          </ThemedView>
        ) : null}
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
          to see changes. Press{" "}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: "cmd + d",
              android: "cmd + m",
              web: "F12",
            })}
          </ThemedText>{" "}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">
            npm run reset-project
          </ThemedText>{" "}
          to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
          directory. This will move the current{" "}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  locationContainer: {
    gap: 8,
  },
  errorText: {
    color: "red",
  },
});
