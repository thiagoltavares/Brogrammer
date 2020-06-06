/* eslint-disable camelcase */
import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import axios from 'axios';
import api from '../../services/api';

import logo from '../../assets/logo.svg';

import './styles.css';

interface IItemsData {
  id: number;
  image_url: string;
  title: string;
}

interface ILocation {
  district: string;
  county: string;
  lat: string;
  lng: string;
}

const CreatePoint: React.FC = () => {
  const history = useHistory();
  const [items, setItems] = useState<IItemsData[]>([]);
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [districs, setDistricts] = useState<string[]>([]);
  const [counties, setCounties] = useState<ILocation[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  });
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    0,
    0,
  ]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const [selectedDistrict, setSelectedDistrict] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      setInitialPosition([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    const getItems = async () => {
      const { data } = await api.get('items');
      setItems(data);
    };

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

      setDistricts(Array.from(uniqueDistrictsSet.values()));
    };

    getItems();
    getLocations();
    setIsLoading(false);
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

      setCounties(county);
    };

    getCounty();
  }, [selectedDistrict, locations]);

  function handleSelectDistrict(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    setSelectedCity('0');
    setSelectedDistrict(city);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const county = event.target.value;
    const location = locations.find((loc) => loc.county === county);
    const newLat = Number(location?.lat);
    const newLng = Number(location?.lng);

    setSelectedCity(county);
    setInitialPosition([newLat, newLng]);
  }

  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([event.latlng.lat, event.latlng.lng]);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  }

  function handleSelectedItem(id: number) {
    const alreadySelected = selectedItems.findIndex((item) => item === id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const { email, name, whatsapp } = formData;
    const district = selectedDistrict;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const itemsSelected = selectedItems;

    const data = {
      name,
      email,
      whatsapp,
      district,
      city,
      longitude,
      latitude,
      items: itemsSelected,
    };

    const response = await api.post('points', data);

    console.log(response);

    alert('Ponto cadastrado com sucesso.');

    history.push('/');
  }

  if (isLoading) {
    return <h1>Loading</h1>;
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="ecoleta" />
        <Link to="/">
          <FiArrowLeft>Voltar para home</FiArrowLeft>
        </Link>
      </header>
      <form onSubmit={handleSubmit}>
        <h1>Cadastro do ponto de coleta</h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
            <span>Insira seus dados</span>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço clicando no mapa</span>
          </legend>

          <div className="field-group">
            <div className="field">
              <label htmlFor="city">Distrito</label>
              <select
                name="city"
                id="city"
                value={selectedDistrict}
                onChange={handleSelectDistrict}
              >
                <option value="00">Escolha seu distrito...</option>
                {districs.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Município</label>
              <select
                name="city"
                id="city"
                value={selectedCity}
                onChange={handleSelectCity}
              >
                <option value="00">Escolha seu Município...</option>
                {counties.map(({ county }) => (
                  <option key={county} value={county}>
                    {county}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Map center={initialPosition} zoom={14} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPosition} />
          </Map>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Items de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>
          <ul className="items-grid">
            {items.map((item) => {
              return (
                <li
                  key={item.id}
                  onClick={() => handleSelectedItem(item.id)}
                  className={selectedItems.includes(item.id) ? 'selected' : ''}
                >
                  <img src={item.image_url} alt="teste" />
                  <span>{item.title}</span>
                </li>
              );
            })}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
};

export default CreatePoint;
