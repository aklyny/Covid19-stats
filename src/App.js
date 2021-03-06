import React,{useState, useEffect} from 'react';
import './App.css';
import {FormControl,MenuItem,Select,Card,CardContent} from '@material-ui/core';
import InfoBox from './infoBox';
import Map from './map';
import Table from './Table';
import "leaflet/dist/leaflet.css";
import LineGraph from './LineGraph';
import {sortdata} from './util';
import {printStat} from './util';

function App() {
  const [countries,setCountries]  = useState([]);
  const [country,setCountry] = useState('Worldwide');
  const [countryInfo,setCountryInfo] = useState({})
  const [tableData,setTableData] = useState([])
  const [mapCenter,setMapCenter] = useState({lat:34.80746,lng:-40.4796})
  const [mapZoom,setMapZoom] = useState(3)
  const [mapCountries,setMapCountries] = useState([])
  const [casesType,setCasesType] = useState("cases")
  // https://disease.sh/v3/covid-19/countries

  useEffect(()=>{
    fetch('https://disease.sh/v3/covid-19/all')
    .then(res=>res.json())
    .then(data=>{
      setCountryInfo(data)
    })
  },[])

  useEffect(()=>{
    const getCountriesData = async()=>{
      await fetch('https://disease.sh/v3/covid-19/countries')
            .then((res)=>res.json())
            .then((data)=>{
              const countries = data.map((item)=>(
                {
                  name:item.country,
                  value:item.countryInfo.iso2
                }
                
              ))
              const sortedData = sortdata(data)
              setTableData(sortedData)
              setCountries(countries);
              setMapCountries(data)
            })
    }
    getCountriesData();
  },[]);
  const onChangeCountry = async(e)=>{
    const countryCode = e.target.value;
    setCountry(countryCode)
    const url = countryCode === "Worldwide" ? ' https://disease.sh/v3/covid-19/all'
    :`https://disease.sh/v3/covid-19/countries/${countryCode}`
    await fetch(url)
    .then(res=>res.json())
    .then((data)=>{
        setCountry(countryCode)
        setCountryInfo(data)
        setMapCenter([data.countryInfo.lat,data.countryInfo.long])
        setMapZoom(4);
    })
  }

  return (
    <div className="app">
    <div className="app__left">
    <div className="app__header">
      <h1>Covid-19 Live Update</h1>
      <FormControl className="app__dropdown">
        <Select
        varient="outline"
        value={country}
        onChange={onChangeCountry}
        >
        <MenuItem value="Worldwide">Worldwide</MenuItem>
        {
          countries.map((item,i)=>(
            <MenuItem key={i} value={item.value}>{item.name}</MenuItem>
          ))
        }
        </Select>
      </FormControl>
      </div>
      <div className="app__stats"> 
        <InfoBox 
        isRed
        active={casesType==='cases'}
        onClick={(e)=>setCasesType("cases")}
         title="CoraVirus Cases" cases={printStat(countryInfo.todayCases)} 
         total={printStat(countryInfo.cases)} />
        <InfoBox 
        active={casesType==='recovered'}
        onClick={(e)=>setCasesType('recovered')}
         title="Recovered" cases={printStat(countryInfo.todayRecovered)} 
         total={printStat(countryInfo.recovered)} />
        <InfoBox 
        isRed
        active={casesType==='deaths'}
        onClick={(e)=>setCasesType('deaths')}
         title="Deceased" cases={printStat(countryInfo.todayDeaths)} 
         total={printStat(countryInfo.deaths)} />
      </div>
      <Map
      casesType={casesType}
       center={mapCenter}
       zoom={mapZoom} 
       countries={mapCountries}
      />
    </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 className="app__graphTitle">Worldwide New {casesType}</h3>
          <LineGraph className="app__graph" caseType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
