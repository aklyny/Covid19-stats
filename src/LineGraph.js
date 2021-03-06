import React, { useState,useEffect } from 'react';
import {Line} from 'react-chartjs-2';
import numeral from 'numeral';
const options = {
    legend:{
        display:false
    },
    elements:{
        point:{
            radius:0
        }
    },
    mainAspectRatio:false,
    tooltips:{
        mode:"index",
        intersect:false,
        callbacks:{
            label:function(tooltipItem,data){
                return numeral(tooltipItem.value).format("+0,0")
            },
        },
    },
    scales:{
        xAxes:[{
            type:"time",
            time:{
                format:'MM/DD/YYYY',
                tooltipFormat: "ll"
            }
        }],
        yAxes:[{
            gridLines:{
                display:false
            },
            ticks:{
                callback:function(value,index,values){
                    return numeral(value).format("0a");
                }
            }
        }]
    }
}
const buildChartData = (data,caseType)=>{
    const chartData = [];
    let lastDataPoint;
   for(let date in data.cases){
        if(lastDataPoint){
            const newDataPoint = {
                x:date,
                y:data[caseType][date] - lastDataPoint 
            }
            chartData.push(newDataPoint);
        }
        lastDataPoint = data[caseType][date];
    }
    return chartData;
}
const LineGraph = ({caseType='cases',...props})=>{
    const [data,setData] = useState({})
    //https://disease.sh/v3/covid-19/historical/all?lastdays=120



    useEffect(()=>{
        const fetchData = async ()=>{
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then(res=>res.json())
            .then(data=>{
                let chartData = buildChartData(data,caseType)
                setData(chartData)
            })
        }
        fetchData();
       
    },[caseType])
    return(
        <div className={props.className}>
            {
                data?.length>0
                &&(
                    <Line 
            options={options} 
             data={{
                 datasets:[{
                     backgroundColor:"rgba(204,16,52,0.6)",
                     borderColor:"#CC1034",
                     data:data
                 }]
             }}
               
            />
                )
                 
            }
        </div>
    )
}

export default LineGraph;