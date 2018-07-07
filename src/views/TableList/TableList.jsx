import React, {Component} from "react";
import { Grid, InputLabel, withStyles } from "material-ui";
import firebase from "../../firebase";
import ChartistGraph from "react-chartist";
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
  Group,
  Star,
  RateReview,
  ThumbUp,
  ThumbDown
} from "@material-ui/icons";
import {
  ProfileCard,
  PlaceCard,
  StatsCard,
  RegularCard,
  Button,
  CustomInput,
  ItemGrid,
  ChartCard,
} from "components";
import dashboardStyle from "assets/jss/material-dashboard-react/dashboardStyle";

import {emailsSubscriptionChart} from "variables/charts";

import avatar from "assets/img/menu-placeholder.png";

class TableList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      place:{},
      topDishes:[],
      topDishesData:{},
      topRatedDishes:[],
      topRatedDishesData:{}
    }
  }
  

sortObject(obj) {
    var arr = [];
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            arr.push({
                'key': prop,
                'value': obj[prop]
            });
        }
    }
    arr.sort(function(a, b) { return b.value - a.value; });
    //arr.sort(function(a, b) { a.value.toLowerCase().localeCompare(b.value.toLowerCase()); }); //use this to sort as strings
    return arr; // returns array
}
 getPlatosMasPedidos(firestore){
    let placeRef = firestore.collection("places");
    let place = {};
    placeRef.doc(this.props.match.params.id).get()
    .then(querySnapshot=> {
      let place = querySnapshot.data();
 
      place.improveTags = this.sortObject(place.improveTags);
      place.perfectTags = this.sortObject(place.perfectTags);
      this.setState({place:place})
      querySnapshot.ref.collection("dishes").orderBy("count","desc").get().then((querySnapshot)=> {
        let topDishes = [];
        let labelsDishes = [];
        let seriesDishes = [];
        querySnapshot.docs.map((snapshot)=>{
          let dish = snapshot.data();
          topDishes.push(dish);
          labelsDishes.push(dish.name);
          seriesDishes.push(dish.count);
          })
          this.setState({
            topDishes:topDishes,
            topDishesData:{
              labels:labelsDishes,
              series:[seriesDishes]
            }

          });
        })
      //rating
       querySnapshot.ref.collection("dishes").orderBy("rating","desc").get().then((querySnapshot)=> {
        let topDishes = [];
        let labelsDishes = [];
        let seriesDishes = [];
        querySnapshot.docs.map((snapshot)=>{
          let dish = snapshot.data();
          topDishes.push(dish);
          labelsDishes.push(dish.name);
          seriesDishes.push(dish.count);
          })
          this.setState({
            topRatedDishes:topDishes,
            topRatedDishesData:{
              labels:labelsDishes,
              series:[seriesDishes]
            }

          });
        })

      }).catch(function(error) {
        console.log("Error getting document GLOBAL : ", error);
      });
  }


componentDidMount() {
    
    const firestore = firebase.firestore();
    const settings = {/* your settings... */ timestampsInSnapshots: true};
    firestore.settings(settings);

    this.getPlatosMasPedidos(firestore);

}

  render(){

    let options =  {
      axisX: {
        showGrid: false
      },
      low: 0,
      high: 5.5,
      chartPadding: {
        top: 0,
        right: 5,
        bottom: 0,
        left: 0
      }
    };
    let optionsDishes = Object.assign({},options);
    optionsDishes.high = this.state.topDishesData.series ? Math.max.apply(null, this.state.topDishesData.series[0])+0.5 : 5;
    let optionsDishesRate = Object.assign({},options);
    optionsDishesRate.high = this.state.topRatedDishesData.series ? Math.max.apply(null, this.state.topRatedDishesData.series[0])+0.5 : 5;

    this.state.place.improveTags ? console.log(this.state.place.improveTags[0]):"";
    let getImproveTag = this.state.place.improveTags ? this.state.place.improveTags[0] : "";
    console.log(this.state.place.improveTags)
    let bestImproveTag = this.state.place.improveTags && getImproveTag.value > 0 ? getImproveTag.key : "Nothing to improve!"
    let getPerfTag = this.state.place.perfectTags ? this.state.place.perfectTags[0] : "";
    let bestPerfectTag = this.state.place.perfectTags && getPerfTag.value > 0 ? getPerfTag.key : "No good quality";
    let descriptionReviews = this.state.place.rating!= undefined ? this.state.place.rating.toFixed(2) +"/5.0" : "0/5.0"
    let descriptionFriendsCount = this.state.place.rating != undefined ? this.state.place.rating : ""
    let descriptionReviewsCount = this.state.place.reviewCount != undefined ?  this.state.place.reviewCount : ""
    let favoriteDish = this.state.topDishes && this.state.topDishes[0] ? this.state.topDishes[0].name : ""
    let mostReviewedDish = this.state.topRatedDishes && this.state.topRatedDishes[0] ? this.state.topRatedDishes[0].name : ""
    let descriptionUser = "Best Dish: "+ favoriteDish + ". \n"+ "Most reviewed dish: " + mostReviewedDish;

    let labelsImprove = [];
    let seriesImprove = [];
    this.state.place.improveTags ? this.state.place.improveTags.map((tag)=>{
      labelsImprove.push(tag.key);
      seriesImprove.push(tag.value)
    }) : null;
    let improveTagsData = {
      labels:labelsImprove,
      series:[seriesImprove]
    }

    let labelsPerfect = [];
    let seriesPerfect = [];
    this.state.place.perfectTags ? this.state.place.perfectTags.map((tag)=>{
      labelsPerfect.push(tag.key);
      seriesPerfect.push(tag.value)
    }) : null;
    let perfectTagsData = {
      labels:labelsPerfect,
      series:[seriesPerfect]
    }


let optionsImproveTags = Object.assign({},options);
    optionsImproveTags.high = improveTagsData.series!=undefined ? Math.max.apply(null, improveTagsData.series[0])+0.5 : 5;
    
    let optionsPerfectTags = Object.assign({},options);
    optionsPerfectTags.high = perfectTagsData.series!= undefined ? Math.max.apply(null, perfectTagsData.series[0])+0.5 : 5;
    
  let avatar = <div className = {this.props.classes.profileButton}
                    role = "button"
                    aria-owns={"simple-menu"}
                    aria-haspopup = "true">
                {this.state.place.name ? this.state.place.name.substring(0,1).toUpperCase():""}
                </div>

  return (
    <div>
      <Grid container>
      <ItemGrid xs={12} sm={12} md={6}>
          <PlaceCard
            avatar={avatar}
            title={this.state.place.name}
            description={descriptionUser}
          />
        </ItemGrid>
        <ItemGrid xs={12} sm={12} md={6}>
          <Grid container>
            <ItemGrid xs={12} sm={12} md={6}>
              <StatsCard
              icon={Star}
              iconColor="blue"
              title="Average rating"
              description={descriptionReviews}
              statIcon={Update}
              statText="real time"
              />

            </ItemGrid>

            <ItemGrid xs={12} sm={6} md={6}>
            <StatsCard
              icon={ThumbUp}
              iconColor="orange"
              title="Best Quality"
              description={bestPerfectTag}
              statIcon={Update}
              statText="real time"
            />
            </ItemGrid>
            <ItemGrid xs={12} sm={6} md={6}>
            <StatsCard
              icon={RateReview}
              iconColor="blue"
              title="Reviews"
              description={descriptionReviewsCount}
              statIcon={Update}
              statText="real time"
            />
            </ItemGrid>
            <ItemGrid xs={12} sm={6} md={6}>
            <StatsCard
              icon={ThumbDown}
              iconColor="orange"
              title="Quality to improve"
              description={bestImproveTag}
              statIcon={Update}
              statText="real time"
            />
            </ItemGrid>
          </Grid>
        </ItemGrid>
        
      </Grid>
      <Grid container>
      <ItemGrid xs={12} sm={12} md={6}>
            <ChartCard
              chart={
                <ChartistGraph
                  className="ct-chart"
                  data={this.state.topDishesData}
                  type="Bar"
                  options={optionsDishes}
                  responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                  listener={emailsSubscriptionChart.animation}
                />
              }
              chartColor="green"
              title="Most ordered dishes"
              statIcon={AccessTime}
              statText="Real time"
            />
            </ItemGrid>
        <ItemGrid xs={12} sm={12} md={6}>
            <ChartCard
              chart={
                <ChartistGraph
                  className="ct-chart"
                  data={this.state.topRatedDishesData}
                  type="Bar"
                  options={optionsDishesRate}
                  responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                  listener={emailsSubscriptionChart.animation}
                />
              }
              chartColor="green"
              title="Best rated dishes"
              statIcon={AccessTime}
              statText="Real time"
            />
        </ItemGrid> 
        <ItemGrid xs={12} sm={12} md={6}>
            <ChartCard
              chart={
                <ChartistGraph
                  className="ct-chart"
                  data={improveTagsData}
                  type="Bar"
                  options={optionsImproveTags}
                  responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                  listener={emailsSubscriptionChart.animation}
                />
              }
              chartColor="blue"
              title="Tags to improve"
              statIcon={AccessTime}
              statText="Real time"
            />
            </ItemGrid>
        <ItemGrid xs={12} sm={12} md={6}>
            <ChartCard
              chart={
                <ChartistGraph
                  className="ct-chart"
                  data={perfectTagsData}
                  type="Bar"
                  options={optionsPerfectTags}
                  responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                  listener={emailsSubscriptionChart.animation}
                />
              }
              chartColor="blue"
              title="Perfect Tags"
              statIcon={AccessTime}
              statText="Real time"
            />
            </ItemGrid>
      </Grid>       
    </div>
  );
  }
} 

export default withStyles(dashboardStyle)(TableList);
