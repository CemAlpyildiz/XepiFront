import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MapScreen from './src/screens/MapScreen';
import AssociationForm from './src/components/AssociationForm';
import AssociationList from './src/screens/AssociationList';

export default function App() {
    return (
        <View style={styles.container}>
            <StatusBar style="auto" backgroundColor='#eab676' />
            {/* <MapScreen/> */}
            {/* <AssociationForm/> */}
            {/* <AssociationList/> */}
            <AssociationList/>
        </View>
    );
}

const styles = StyleSheet.create({

});
