import { useState, useEffect } from "react";
import { StyleSheet, Text, View, StatusBar, Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";

const CustomMap = () => {
    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

    const [markers, setMarkers] = useState([]);

    const onRegionChange = (region) => {
        console.log(region);
    }

    const getAssociations = async () => {
        try {
           // const response = await fetch('http://192.168.1.18:3000/associations/', {
            const response = await fetch('http://10.102.132.52:3000/associations/', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not oks');
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const fetchMarkers = async () => {
            const oAssociations = await getAssociations();
            const aAssociations = Array.from(oAssociations);

            const newMarkers = aAssociations.map((association, index) => {
                let oLocation = association.coordinate.split(',');

                return {
                    key: index.toString(),
                    title: association.name,
                    coordinate: {
                        latitude: parseFloat(oLocation[1]),
                        longitude: parseFloat(oLocation[0]),
                    },
                    description: "Lorem ipsum dolor sit emet"
                };
            });

            setMarkers(newMarkers);
        };

        fetchMarkers();
    }, []);

    return (
        <View style={{marginTop: statusBarHeight }}>
            <MapView 
                style={styles.map}
                onRegionChange={onRegionChange}
                initialRegion={{
                    latitude: 43.59971795463876,
                    latitudeDelta: 0.3285121395972439,
                    longitude: 3.878778163343668, 
                    longitudeDelta: 0.2249444648623471,
                }}
            >
                {markers.map(marker => (
                    <Marker 
                        key={marker.key}
                        coordinate={marker.coordinate}
                        title={marker.title}
                        description={marker.description}
                    />
                ))}
            </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    container_map: {

    },
    map: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 25,
        textAlign: 'center',
    }
})

export default CustomMap;