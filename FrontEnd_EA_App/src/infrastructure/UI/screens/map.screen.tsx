import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Platform } from "react-native";
import { ImageBackground, Image} from 'react-native';
import { Callout, Marker } from "react-native-maps";
import MapView from 'react-native-maps';
import { LocationEntity } from "../../../domain/location/location.entity";
import SearchBar from "../components/searchbar/searchbar";
import * as Font from 'expo-font';
import * as Location from 'expo-location';
import { LocationService } from "../../../infrastructure/services/location/location.service";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

async function loadFonts() {
  await Font.loadAsync({
    'Rafaella': require('../../../../assets/fonts/Rafaella.ttf'),
    'SFNS': require('../../../../assets/fonts/SFNS.otf'),
  });
}

const MapScreen = () => {
  const [locations, setLocationList] = useState<LocationEntity[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const mapRef = useRef<MapView>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const navigation = useNavigation();
  const [clickedLocation, setClickedLocation] = useState("");

  const locationIcon = require('../../../../assets/location_apple.png');
  const fireIcon = require('../../../../assets/location_fire.png');

  const [activities, setActivities] = useState<LocationEntity[]>([]);  // Estas son las Locations pero nuestras (las de las actividades).

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await LocationService.getLocations();
      if (response) {
        const activities = response.data as LocationEntity[];
        setActivities(activities);
      } else {
        console.error('Error fetching activities: Response is undefined');
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  useEffect(() => {
    loadFonts().then(() => {
      setFontsLoaded(true);
    });
  }, []);

  const titleFont = Platform.select({
    ios: 'Rafaella',
    android: 'Rafaella',
  });
  const bodyFont = Platform.select({
    ios: 'SFNS',
    android: 'SFNS',
  });


  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync({});

          const { latitude, longitude } = location.coords;

          const region = {
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };

          mapRef.current?.animateToRegion(region);
        }
      } catch (error) {
        console.log("Error al obtener la ubicación:", error);
      }
    };

    getCurrentLocation();
  }, []);

  const handleSearchWrapper = (searchText: string) => {
    setSearchValue(searchText);
    handleSearch();
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${searchValue}&format=json`
      );
      console.log("SE ESTÁ BUSCANDO:", `https://nominatim.openstreetmap.org/search?q=${searchValue}&format=json`);
      const data = await response.json();
      const limitedResults = data.slice(0, 3);
      setSearchResults(limitedResults);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
    }
  };

  useEffect(() => {
    console.log("RESPUESTA LOCATIONS:", searchResults);
  }, [searchResults]);

  const calculateZoom = (importance: number) => {
    return Math.floor(18 - Math.log2(importance));
  };

  const handleSearchResult = (result: any) => {
    setSelectedLocation(result);
    const { lat, lon, importance } = result;
    const zoom = calculateZoom(importance);
    const region = {
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0922,
    };
    mapRef.current?.animateToRegion(region, zoom);
  };

  const handleGoToListActivities = (uuid:string) => {
    if (clickedLocation.toString() == uuid.toString()){
      setClickedLocation("");
      navigation.navigate("ActivitiesLocation" as never, {uuid} as never); // UserScreen
    }
    else{
      setClickedLocation(uuid);
    }
  };

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      width: '100%',
      height: '100%',
    },
    searchContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1,
      padding: 0,
    },
    locationList: {
      backgroundColor: 'transparent',
      borderRadius: 0,
      padding: 0,
      marginTop: -18,
      marginLeft: 20,
      marginRight: 20,
    },
    locationItem: {
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      marginBottom: 10,
    },
    locationResult: {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      padding: 6,
      color: 'white',
      fontFamily: bodyFont,
      fontSize: 14,
      marginBottom: 0,
    },
    selectedLocationResult: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: 6,
      color: 'white',
      fontFamily: bodyFont,
      fontSize: 14,
      marginBottom: 0,
    },
    selectedLocationItem: {},
  });

  return (
    <View style={styles.container}>
      <MapView style={styles.map} ref={mapRef}>
        {searchResults.map((result) => (
          <Marker
            key={result.place_id}
            coordinate={{
              latitude: parseFloat(result.lat),
              longitude: parseFloat(result.lon),
            }}
            title={result.display_name}
            description={result.address}
            onPress={() => handleSearchResult(result)}
            pinColor={result === selectedLocation ? "blue" : "red"}
          />
        ))}
  
        {activities.map((activity) => (
        <Marker
          key={activity.uuid}
          coordinate={{
            latitude: parseFloat(activity.latLocation),
            longitude: parseFloat(activity.lonLocation),
          }}
          title={activity.nameLocation}
          description={activity.descriptionLocation}
          image={fireIcon}
          onPress={() => handleGoToListActivities(activity.uuid)}
          style={{ width: 40, height: 40 }} 
        >
        </Marker>
      ))}
      </MapView>
      <View style={styles.searchContainer}>
        <SearchBar onSearch={handleSearchWrapper} />
        <View style={styles.locationList}>
          {searchResults.map((result) => (
            <TouchableOpacity
              key={result.place_id}
              style={[
                styles.locationItem,
                result === selectedLocation && styles.selectedLocationItem,
              ]}
              onPress={() => handleSearchResult(result)}
            >
              <Text
                style={[
                  styles.locationResult,
                  result === selectedLocation && styles.selectedLocationResult,
                ]}
              >
                {result.display_name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
  

};

export default MapScreen;