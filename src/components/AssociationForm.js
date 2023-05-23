import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar, Platform, ScrollView } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';

const AssociationForm = () => {

    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

    // Il est composé de la lettre W, suivie de 9 chiffres. 
    const [rna, setRna] = useState(''); 
    const [name, setName] = useState('');
    const [adresse, setAdresse] = useState('');
    const [town, setTown] = useState('');
    const [postcode, setPostcode] = useState('');
    const [phone, setPhone] = useState('') ;
    const [type, setType] = useState(''); 

    const checkRna = (rna) => {
        // Vérification du format RNA
        const rnaRegex = /^W\d{9}$/;
        return rnaRegex.test(rna);
    };
    
    const checkPhoneNumber = (number) => {
        // Vérification du format téléphone
        const phoneRegex = /^0[1-9]\d{8}$/;
        return phoneRegex.test(number);
    };

    const resetForm = () => {
        setRna('');
        setName('');
        setAdresse('');
        setTown('');
        setPostcode('');
        setPhone('');
        setType('null');
    };

    const getCoordinate = async (adresse, town, postcode) => 
    {
        let adressPlus = adresse.replaceAll(' ', '+') + '+' + postcode + '+' + town;
        //let addressPlus = adresse.split(' ').join('+') + '+' + postcode + '+' + town;

        try{
            const response = await axios.get('https://api-adresse.data.gouv.fr/search/?q='+adressPlus);

            return response.data.features[0].geometry.coordinates;
        }
        catch(error){
            throw new Error('Network response was not ok');
        }

    }
    
    const handleSubmit = async () => {
        // Traitement des données du formulaire
        const coordinate = await getCoordinate(adresse, town, postcode);
      
        if (rna !== '' && checkRna(rna) && name !== '' && adresse !== '' && phone !== '' && checkPhoneNumber(phone) && type !== '')
        {
            const associationObj = {
                rna: rna,
                name: name,
                adresse: adresse,
                town: town,
                postcode: postcode,
                coordinate: coordinate.join(','),
                phone: phone,
                type: type,
            };
      
            try {
                const response = await axios.post('http://192.168.1.18:3000/associations/add', associationObj);

                console.log(response);

                if (response.status === 200 || response.status === 201) 
                {
                    setRna('');
                    setName('');
                    setAdresse('');
                    setTown('');
                    setPostcode('');
                    setPhone('');
                    setType('');
                }
            } 
            catch (error) {

            }
        }
    }

    return (
        <ScrollView>
            <View style={{marginTop: statusBarHeight }}>
                <View style={styles.container}>
                    <Text style={styles.title}>Ajouter une association</Text>
                    <Text style={styles.label}>RNA :</Text>
                    <TextInput
                        style={styles.inputText}
                        onChangeText={setRna}
                        value={rna}
                        maxLength={10}
                        placeholder="W123456789"
                    />
                    <Text style={styles.label}>Nom :</Text>
                    <TextInput
                        style={styles.inputText}
                        onChangeText={setName}
                        value={name}
                        placeholder="Nom"
                    />
                    <Text style={styles.label}>Téléphone :</Text>
                    <TextInput
                        style={styles.inputText}
                        onChangeText={setPhone}
                        value={phone}
                        maxLength={10}
                        keyboardType="numeric"
                        placeholder="0623456789"
                    />
                    <Text style={styles.label}>Adresse :</Text>
                    <TextInput
                        style={styles.inputText}
                        onChangeText={setAdresse}
                        value={adresse}
                        placeholder="Adresse"
                    />
                    <Text style={styles.label}>Ville :</Text>
                    <TextInput
                        style={styles.inputText}
                        onChangeText={setTown}
                        value={town}
                        placeholder="Ville"
                    />
                    <Text style={styles.label}>Code Postal :</Text>
                    <TextInput
                        style={styles.inputText}
                        onChangeText={setPostcode}
                        value={postcode}
                        placeholder="Code Postal"
                    />
                    <Text style={styles.label}>Type d'association :</Text>
                    <Picker
                        selectedValue={type}
                        onValueChange={(itemValue, itemIndex) => setType(itemValue)}
                        style={styles.inputText}
                    >
                        <Picker.Item label="Sélectionner un type" value="null" />
                        <Picker.Item label="Humanitaire" value="humanitaire" />
                        <Picker.Item label="Animalier" value="animalier" />
                        <Picker.Item label="Sportif" value="sportif" />
                        <Picker.Item label="Social" value="social" />
                    </Picker>
                    
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Envoyer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '85%',
        alignSelf: 'center', 
        color: "#000",
    },
    title: {
        fontSize: 32,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 20
    },
    label: {
      marginVertical: 20,
      color: '#000', // Texte noir
      fontSize: 15,
      fontWeight: 600
    },
    inputText: {
        backgroundColor: "#F2F2F2",
        color: "#000000",
        height: 57,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        borderRadius: 20,
        padding: 20,
    },
    picker:{
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
    },

    button: {
        backgroundColor: '#F9943B',
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
        padding: 10,
        marginTop: 30,
        marginBottom: 30,
    },
    buttonText: {
        color: '#fff',
        fontSize: 26,
        fontWeight: '600',
        textAlign: 'center'
    },
   
});

export default AssociationForm;