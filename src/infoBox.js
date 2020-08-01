import React from 'react';
import './infoBox.css'
import {Card,CardContent,Typography} from '@material-ui/core'
const InfoBox = ({title,cases,isRed,total,active,...props})=>{
    return(
            <Card  onClick={props.onClick}
            className={`infoBox ${active && 'infoBox--selected'} 
            ${isRed && 'infoBox--red'}
            `}>
                <CardContent>
                    <Typography 
                    color="textSecondary"
                    className="infoBox__title"
                    >{title}</Typography>
                    <h2 className={`infoBox__cases ${!isRed && 'infoBox__cases--green'}`}>{cases}</h2>
                    <Typography color="textSecondary">{total}</Typography>
                </CardContent>
            </Card>
    )
}

export default InfoBox;