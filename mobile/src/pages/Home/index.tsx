import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

import {
  View,
  Image,
  StyleSheet,
  Text,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import logo from '../../assets/logo.png';
import homeBackground from '../../assets/home-background.png';

interface ILocation {
  district: string;
  county: string;
}

interface IDistric {
  label: string;
  value: string;
}

interface ICity {
  label: string;
  value: string;
  lat: number;
  lng: number;
}

const Home: React.FC = () => {
  const [selectedDistrict, setDelectedDistrict] = useState('');
  const [city, setCity] = useState('');
  const navigation = useNavigation();
  const [districs, setDistricts] = useState<IDistric[]>([]);
  const [counties, setCounties] = useState<ICity[]>([]);
  const [locations, setLocations] = useState<ILocation[]>([]);

  useEffect(() => {
    const getLocations = async () => {
      const { data } = await axios.get(
        'https://simplemaps.com/static/data/country-cities/pt/pt_spreadsheet.json',
      );

      const locationsLoaded: ILocation[] = [];

      data.map((item: string[]) => {
        const district = item[5];
        const county = item[0];
        const lat = item[1];
        const lng = item[2];

        const location = {
          district,
          county,
          lat,
          lng,
        };

        locationsLoaded.push(location);
        return null;
      });

      locationsLoaded.shift();

      setLocations(locationsLoaded);

      const uniqueDistrictsSet = new Set(
        locationsLoaded.map((i) => i.district),
      );

      const newD: IDistric[] = [];
      Array.from(uniqueDistrictsSet.values()).map((dis) => {
        newD.push({
          label: dis,
          value: dis,
        });

        return null;
      });

      setDistricts(newD);
    };

    getLocations();
  }, []);

  useEffect(() => {
    const getCounty = async () => {
      const county: ILocation[] = [];
      locations.map((loc) => {
        if (loc.district === selectedDistrict) {
          county.push(loc);
        }
        return county;
      });

      const newC: ICity[] = [];

      county.map((dis) => {
        newC.push({
          label: dis.county,
          value: dis.county,
          lat: dis.lat,
          lng: dis.lng,
        });
        return null;
      });

      setCounties(newC);
    };

    getCounty();
  }, [selectedDistrict, locations]);

  const handleNavigationToPoints = () => {
    const localization = counties.find((c) => c.value === city);

    navigation.navigate('Points', {
      district: selectedDistrict,
      city,
      coord: [Number(localization?.lat), Number(localization?.lng)],
    });
  };

  const handleDistrict = (value: string) => {
    setDelectedDistrict(value);
  };

  const handleCity = (value: string) => {
    setCity(value);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground
        source={homeBackground}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={logo} />
          <View>
            <Text style={styles.title}>
              Local de estudos para programadores
            </Text>
            <Text style={styles.description}>
              Ajudamos programadores a encontrar parceiros de estudos em várias
              stacks...
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <RNPickerSelect
            value={selectedDistrict}
            onValueChange={(value) => handleDistrict(value)}
            style={pickerSelectStyles}
            placeholder={{
              label: 'Selecione seu distrito...',
            }}
            items={districs}
          />
          <RNPickerSelect
            value={city}
            onValueChange={(value) => handleCity(value)}
            style={pickerSelectStyles}
            placeholder={{
              label: 'Selecione sua cidade...',
            }}
            items={counties}
          />

          <RectButton style={styles.button} onPress={handleNavigationToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24} />
              </Text>
            </View>

            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#145DDB',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#00B0FF',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: '#FFF',
    color: '#322153',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
    paddingVertical: 8,
    borderWidth: 0.5,
    color: '#322153',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default Home;
