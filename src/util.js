import React from 'react';
import numeral from 'numeral';
import {Popup,Circle} from 'react-leaflet';

const caseThemeColors ={
  cases:{
    hex:"#CC1034",
    rgb:"rgb(204,16,52)",
    multiplier:800
  },
  recovered:{
    hex:"#7dd71d",
    rgb:"rgb(125,215,29)",
     multiplier:1200
  },
  deaths:{
    hex:"#fb4443",
    rgb:"rgb(251,68,67)",
    multiplier:2000
  }
}
export const sortdata = (data)=>{
    const sortedData = [...data];

  return sortedData.sort((a,b)=>(a.cases>b.cases ? -1 : 1))
}

export const printStat = (stat)=>(
  stat ? `+${numeral(stat).format("0.0a")}` : "+0"
)

export const showDataOnMap = (data,caseType='cases')=>(
  data.map(country=>(
    <Circle
    center={[country.countryInfo.lat,country.countryInfo.long]}
    fillOpacity={0.4}
    color={caseThemeColors[caseType].hex}
    fillColor={caseThemeColors[caseType].hex}
    radius={
      Math.sqrt(country[caseType])*caseThemeColors[caseType].multiplier
    }
    >
    <Popup>
      <div className="info-container">
        <div className="info-flag" style={{backgroundImage:`url(${country.countryInfo.flag})`}}></div>
        <div className="info-name">{country.country}</div>
        <div className="info-cases">Cases:{numeral(country.cases).format("0,0")}</div>
        <div className="info-recovered">Recovered:{numeral(country.recovered).format("0,0")}</div>
        <div className="info-deaths">Deaths:{numeral(country.deaths).format("0,0")}</div>
        <div></div>
      </div>
    </Popup>
    </Circle>
  ))
)