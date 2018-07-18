import React, {Component} from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import PerfectScrollbar from "perfect-scrollbar";

// react plugin for creating charts
import ChartistGraph from "react-chartist";
import moment from "moment";
import {
  AccessTime,
  Restaurant,
  ContentCopy,
  Store,
  InfoOutline,
  Warning,
  DateRange,
  LocalOffer,
  Update,
  SystemUpdate,
  ArrowUpward,
  Map,
  Accessibility,
  Favorite,
  NoteAdd,
  Style,
  RateReview,
  RestaurantMenu
} from "@material-ui/icons";

import Maps from "../Maps/Maps"
import { withStyles, Grid } from "material-ui";

import {
  ChartCard,
  StatsCard,
  RegularCard,
  Table,
  ItemGrid,
  AutoSuggest,
  BarChart,
  IconButton,
  Button,
  ProfileCard,
  ColombiaMap,
  PercentageVotes
} from "components";



import {emailsSubscriptionChart} from "variables/charts";

import dashboardStyle from "assets/jss/material-dashboard-react/dashboardStyle";

const baseUrl = "https://raw.githubusercontent.com/cegonzalv/cegonzalv.github.io/master/";
const primeraVuelta = {
  "url":"https://raw.githubusercontent.com/cegonzalv/cegonzalv.github.io/master/primera_vuelta_presidencial.csv"
};
const segundaVuelta = {
  "url":"https://raw.githubusercontent.com/cegonzalv/cegonzalv.github.io/master/segunda_vuelta_presidencial.csv"
}
const candidatosPrimera = [{
  nombre:"Iván Duque",
  id:"iván-duque",
  csv:"iván duque",
  partido:"Centro Democrático"
},
{
  nombre:"Gustavo Petro",
  id:"gustavo-petro",
  csv:"gustavo petro",
  partido:"Coalición Petro Presidente"
},
{
  nombre:"Sergio Fajardo",
  id:"sergio-fajardo",
  csv:"sergio fajardo",
  partido:"Coalición Colombia"
},
{
  nombre:"Germán Vargas Lleras",
  id:"germán-vargas-lleras",
  csv:"germán vargas lleras",
  partido:"Coalición #Mejor Vargas Lleras",
},
{
  nombre:"Humberto De La Calle",
  id:"humberto-de-la-calle",
  csv:"humberto de la calle",
  partido:"Coalición Partido Liberal y ASI",
},
{
  nombre:"Promotores del Voto en Blanco",
  id:"promotores-voto-en-blanco",
  csv:"promotores voto en blanco",
  partido:""
}
]
const candidatosSegunda =[{
  nombre:"Iván Duque",
  id:"iván-duque",
  csv:"iván duque",
  partido:"Centro Democrático"
},
{
  nombre:"Gustavo Petro",
  id:"gustavo-petro",
  csv:"gustavo petro",
  partido:"Coalición Petro Presidente"
}]

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions:[],
      vuelta: "primera",
      candidate:{},
    };

  }

  compare(a,b) {
    if (a.count < b.count)
      return -1;
    if (a.count > b.count)
      return 1;
    return 0;
  }

  separarNombres(names){
    return names.split(' ').join('-');
  }


  cambiarPrimeraVuelta(){
    if(this.state.vuelta != "primera")
    this.setState({vuelta:"primera"})
  }
  cambiarSegundaVuelta(){
    if(this.state.vuelta != "segunda")
    this.setState({vuelta:"segunda"})
  }
  handleCandidateClick(candidato){
    this.setState({candidate:candidato})
    this.handleScrollToElement();
  }
  handleScrollToElement() {
  let checkExists = setInterval(()=> {
  const testNode = ReactDOM.findDOMNode(this.refs.candidate)
   if (testNode) {
      console.log("Exists!");
      clearInterval(checkExists);
      this.props.mainPanel.scrollTop = testNode.offsetTop - 100;
      this.props.ps.update();
   }
  }, 500); // check every 500ms
  }
  
      precisionRound(number, precision) {
        var factor = Math.pow(10, precision);
        return Math.round(number * factor) / factor;
      }

      render() {
        let descripcionDepartamento = "Vista detallada de las votaciones que recibió " + this.state.candidate.nombre + " por departamento."
         const encodingDepartamento = {
          "x": {"field": "departamento", "type": "ordinal"},
          "y": {"field": this.state.candidate.csv, "type": "quantitative"}
        }



        let data = primeraVuelta;
        if(this.state.vuelta == "segunda"){
          data = segundaVuelta;
        }
        let profiles = [];
        if(this.state.vuelta == "primera"){
          candidatosPrimera.map((candidato)=>{
            console.log(baseUrl + this.separarNombres(candidato.id) + ".jpg")
            profiles.push(
            <ItemGrid xs={2} sm={2} md={4} key={candidato.id} onClick={()=>this.handleCandidateClick(candidato)}>
              <ProfileCard
              avatar={baseUrl + this.separarNombres(candidato.id) + ".jpg"}
              title={candidato.nombre}
              subtitle={candidato.partido}
              description={<div><PercentageVotes candidato = {candidato.csv} data = {data}/><ColombiaMap/></div>}
              />
            </ItemGrid>
            )
          })
        }
        else{
        candidatosSegunda.map((candidato)=>{
          profiles.push(
            <ItemGrid xs={6} sm={6} md={6} key={candidato.id} onClick={()=>this.handleCandidateClick(candidato)}>
            <ProfileCard
              avatar={baseUrl + this.separarNombres(candidato.id) + ".jpg"}
              title={candidato.nombre}
              subtitle={candidato.partido}
              description={""}
            />
          </ItemGrid>)
        })
      }
          
    return (
      <div>
      <Grid container>
          <h3>
          Estos gráficos muestran estadísticas de las votaciones de primera y segunda vuelta de las elecciones
          de Colombia del 2018.
          </h3>
          <ItemGrid xs={12} sm={12} md={4}/>
          <ItemGrid xs={12} sm={12} md={4}>
            <Button
              title="Seleccionar primera vuelta"
              color="info"
              onClick={()=>this.cambiarPrimeraVuelta()}
            >
            Primera Vuelta
            </Button>
            <Button
              title="Seleccionar segunda vuelta"
              color="success"
              onClick={()=>this.cambiarSegundaVuelta()}
            >
            Segunda Vuelta
            </Button>
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={4}/>

        </Grid>
        <h3>
          Candidatos
          </h3>
          <h4>
          (Seleccione uno para ver sus estadísticas)
          </h4>
        <Grid container>
        {
          profiles
        }
        </Grid>

      {this.state.candidate.csv &&
      <div ref="candidate">
      <Grid container>
          <ItemGrid xs={12} sm={10} md={10}>
          <RegularCard
              headerColor="green"
              cardTitle="Votaciones por departamento"
              cardSubtitle={descripcionDepartamento}
              content={
              <BarChart data= {data} encoding = {encodingDepartamento}
              />
          }
          />
          </ItemGrid>
        </Grid>

        </div>
      }
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
