import React, {Component} from "react";
import PropTypes from "prop-types";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
import firebase from "../../firebase";
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
  AutoSuggest
} from "components";



import {emailsSubscriptionChart} from "variables/charts";

import dashboardStyle from "assets/jss/material-dashboard-react/dashboardStyle";

class Dashboard extends Component {
    constructor(props) {
    super(props);
    this.state = {
      value: 0,
      reviewsDailyAggregation:null,
      reviewsWeeklyAggregation:null,
      weeklyPlaceData:{},
      dailyPlaceData:{},
      dataMaps:[],
      maxPlaces:5,
      countUsers:0,
      wPlacessSortAverageRating:{},
      dPlacessSortAverageRating:{},
      top5dishes:{},
      numPlacesTotal:0,
      selectedUID:"",
      numReviewsTotal:0,
      averageGlobalReviews:0,
      suggestions:[],
      topTagPlaces:{},
      tagToImprove : "Tag",
      tagTopRestaurant : "restaurant"
    };

    this.topReviews = [];
  }


  getCurrentUsers(firestore, collection){
    let userRef = firestore.collection(collection);
    let users = [];
    let usersSuggestions = {
    title: 'Users',
    usersPlaces: []
    };
    userRef.get()
    .then(querySnapshot=> {
      this.setState({countUsers:querySnapshot.docs.length});
      querySnapshot.docs.map((snapshot)=>{
        let user = snapshot.data();
        users.push(user)
        usersSuggestions.usersPlaces.push({name:user.username,userPlace:user})
      })
      let suggestions = this.state.suggestions;
      suggestions.push(usersSuggestions);
      this.setState({countUsers:querySnapshot.docs.length, suggestions:suggestions});
      }).catch(function(error) {
        console.log("Error getting document USERS : ", error);
      });
  }

  getPlaces(firestore, collection){
    let placesRef = firestore.collection(collection);
    let places = [];
    let placesSuggestions = {
    title: 'Places',
    usersPlaces: []
    };;
    let countAmbient = 0;
    let countPresent = 0;
    let countService = 0;
    let countTaste = 0;
    let countTemperature = 0;

    placesRef.get()
    .then(querySnapshot=> {
      
      querySnapshot.docs.map((snapshot)=>{
        let plac = snapshot.data();
        placesSuggestions.usersPlaces.push({name:plac.name,userPlace:plac})
        places.push(plac)
      });
        let suggestions = this.state.suggestions;
      suggestions.push(placesSuggestions);
      this.setState({suggestions:suggestions});

      for(var i=0; i<places.length ; i++){
        let pla = places[i];
        countAmbient += pla.improveTags.Ambient;
        countPresent += pla.improveTags.Presentation;
        countService += pla.improveTags.Service;
        countTaste += pla.improveTags.Taste;
        countTemperature = pla.improveTags.Temperature;
      }

      let dataTagsPLaces = {
        labels:["Ambient","Presentation","Service","Taste","Temperature"],
        series:[[countAmbient,countPresent,countService,countTaste,countTemperature]]
      }

      //let topTagIndex = dataTagsPLaces.series.indexOf(Math.max(dataTagsPLaces.series));
      let topTagIndex = dataTagsPLaces.series[0].indexOf(Math.max.apply(null, dataTagsPLaces.series[0]));
      if(topTagIndex>=0){
          if(topTagIndex==0){ this.setState({tagToImprove:"Ambient"});}
          if(topTagIndex==1){ this.setState({tagToImprove:"Presentation"}); }
          if(topTagIndex==2){ this.setState({tagToImprove:"Service"}); }
          if(topTagIndex==3){ this.setState({tagToImprove:"Taste"}); }
          if(topTagIndex==4){ this.setState({tagToImprove:"Temperature"}); }
      }

      this.setState({
        topTagPlaces : dataTagsPLaces
      });

      }).catch(function(error) {
        console.log("Error getting document USERS : ", error);
      });
  }

  getGlobalStats(firestore, collection){
    let globalRef = firestore.collection(collection).doc("statistics");
    let reviews = [];
    let sumtotal = 0;
    globalRef.get()
    .then(querySnapshot=> {
      let stats = querySnapshot.data();
      this.setState({
        numReviewsTotal:stats.reviewCount,
        averageGlobalReviews : stats.ratingAverage
      });
      }).catch(function(error) {
        console.log("Error getting document GLOBAL : ", error);
      });
  }
 
  getDishes(firestore, collection){
    let dishes = [];
    let labelsDishes = [];
    let seriesDishes = [];
    let dishesRef = firestore.collection(collection);

    dishesRef.orderBy("count","desc").limit(5).get()
    .then(querySnapshot=> {
      querySnapshot.docs.map((snapshot)=>{
        let dish = snapshot.data();
        dishes.push(dish)
      })

      for (var i=0; i<dishes.length ; i++){
        let dish = dishes[i];
        labelsDishes.push(dish.name);
        seriesDishes.push(dish.count);
      }

      let dataDishes = {
        labels:labelsDishes,
        series:[seriesDishes]
      }
      this.setState({
        dishes:dishes,
        top5dishes:dataDishes
      });
      }).catch(function(error) {
        console.log("Error getting document Dishes : ", error);
      });
  }

  getReviewsAggregation(firestore, collection){
  let reviewsRef = firestore.collection(collection)
    reviewsRef.orderBy("createdAt","desc")
    .limit(1).get()
    .then(querySnapshot => {
      if(!querySnapshot.docs[0]){
        throw new Error("No reviews");
      }
      let snapshot = querySnapshot.docs[0];
      let labels = [];
      let series = [];
      let labelsAverage = [];
      let seriesAverage = [];
      let review = snapshot.data();
      
      let places = review.places;
      let numPLaces = places.length;
      let placesSortAverageRating = review.places;

      places.sort(this.compare);
      placesSortAverageRating.sort(this.compareAverageRating)
      this.setState({tagTopRestaurant:placesSortAverageRating[placesSortAverageRating.length-1].name})
      for(var i = 0; i < places.length; i++){
        let place = places[i];
        labels.push(place.name);
        series.push(place.count);
        if(i===4){
          break;
        }
          
        }

      for(var i = 0; i < placesSortAverageRating.length; i++){
        let rPlace = placesSortAverageRating[i];
        labelsAverage.push(rPlace.name);
        seriesAverage.push(rPlace.averageRating);
        if (i==4) { break; }
      }
      
      let data = {
        labels:labels,
        series:[series]
      }
      let dataAverage = {
        labels:labelsAverage,
        series: [seriesAverage]
      }
      if(collection === "reviewsDailyAggregation") 
        this.setState(
          {dailyPlaceData:data,reviewsDailyAggregation:review,dPlacessSortAverageRating:dataAverage, numPlacesTotal:numPLaces});
      else
        this.setState({weeklyPlaceData:data,reviewsWeeklyAggregation:review,wPlacessSortAverageRating:dataAverage, numPlacesTotal:numPLaces});
      }, err => {
        console.log(`Encountered error: ${err}`);
    })
    .catch(function(err) {
      return console.log("no reviews")
    });
}
  componentDidMount() {
    var start = new Date();
    start.setHours(0,0,0,0);

    const firestore = firebase.firestore();
    const settings = {/* your settings... */ timestampsInSnapshots: true};
    firestore.settings(settings);

    let query = firestore.collection('locations').where("createdAt",">=",start);
    query.get()
    .then(querySnapshot => {
      let locations = [];

      const google = window.google
      querySnapshot.docs.map((snapshot=>{
        let location = snapshot.data();
        let dataMap = {location: new google.maps.LatLng(location.lat, location.lng)}
        locations.push(dataMap);
        return locations
      }))
      this.setState({dataMaps:locations})
      }, err => {
        console.log(`Encountered error: ${err}`);
    });
    this.getReviewsAggregation(firestore, "reviewsDailyAggregation");
    this.getReviewsAggregation(firestore,"reviewsWeeklyAggregation");
    this.getCurrentUsers(firestore,"users"); 
    this.getDishes(firestore,"dishes");
    this.getGlobalStats(firestore,"global");
    this.getPlaces(firestore,"places"); 
  }
  compare(a,b) {
    if (a.count < b.count)
      return -1;
    if (a.count > b.count)
      return 1;
    return 0;
}

compareAverageRating(a,b) {
    if (a.averageRating < b.averageRating)
      return -1;
    if (a.averageRating > b.averageRating)
      return 1;
    return 0;
}

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };
  getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day === 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }

  precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}


  render() {
    const reviewsDaily = this.state.reviewsDailyAggregation;
    const reviewsWeekly = this.state.reviewsWeeklyAggregation;
    const averageRatingDaily = this.state.dPlacessSortAverageRating;
    const averageRatingWeekly = this.state.wPlacessSortAverageRating;
    const top5dish = this.state.top5dishes;
    
    const lastUpdatedDay = reviewsDaily ? 
    "last updated: " + moment.unix(reviewsDaily.createdAt.seconds).fromNow():"Daily Reviews haven't been updated";
    const lastUpdatedWeek = reviewsWeekly ? 
    "last updated: " + moment.unix(reviewsWeekly.createdAt.seconds).fromNow():"Weekly Reviews haven't been updated";

    const tableHeader = ["Place","Reviews","Latitude","Longitude"];
    let tableDailyData = [];
    if(reviewsDaily)
    reviewsDaily.places.map((place)=>{
      return tableDailyData.push([place.name,place.count.toString(),this.precisionRound(place.lat,5).toString(),this.precisionRound(place.lng,5).toString()]);
    })
    let tableWeeklyData = [];
    if(reviewsWeekly)
    reviewsWeekly.places.map((place)=>{
      return tableWeeklyData.push([place.name,place.count.toString(),this.precisionRound(place.lat,5).toString(),this.precisionRound(place.lng,5).toString()]);
    })
    let descriptionReviews = this.state.averageGlobalReviews ? this.state.averageGlobalReviews.toFixed(2) +"/5.0" : "0/5.0"
    let maxDaily = this.state.dailyPlaceData.series ? Math.max.apply(null, this.state.dailyPlaceData.series[0])+0.5 : 5;
    let maxWeekly = this.state.weeklyPlaceData.series ? Math.max.apply(null, this.state.weeklyPlaceData.series[0])+0.5 : 5;
    let maxDailyAverageRating = this.state.dPlacessSortAverageRating.series ? Math.max.apply(null, this.state.dPlacessSortAverageRating.series[0])+0.5 : 5; 
    let maxWeeklyAverageRating = this.state.wPlacessSortAverageRating.series ? Math.max.apply(null, this.state.wPlacessSortAverageRating.series[0])+0.5 : 5; 
    let maxTop5Dishes = this.state.top5dishes.series ? Math.max.apply(null, this.state.top5dishes.series[0])+0.5 : 5; 
    let maxTopTagsPlaces = this.state.topTagPlaces.series ? Math.max.apply(null, this.state.topTagPlaces.series[0])+0.5 : 5;
    
    let optionsDaily =  {
      axisX: {
        showGrid: false
      },
      low: 0,
      high: maxDaily,
      chartPadding: {
        top: 0,
        right: 5,
        bottom: 0,
        left: 0
      }
    };
    let optionsWeekly =  {
      axisX: {
        showGrid: false
      },
      low: 0,
      high: maxWeekly,
      chartPadding: {
        top: 0,
        right: 5,
        bottom: 0,
        left: 0
      }
    };
    let optionsDailyAvergageRating =  {
      axisX: {
        showGrid: false
      },
      low: 0,
      high: maxDailyAverageRating,
      chartPadding: {
        top: 0,
        right: 5,
        bottom: 0,
        left: 0
      }
    };
    let optionsWeeklyAvergageRating =  {
      axisX: {
        showGrid: false
      },
      low: 0,
      high: maxWeeklyAverageRating,
      chartPadding: {
        top: 0,
        right: 5,
        bottom: 0,
        left: 0
      }
    };
    let optionsTop5Dishes =  {
      axisX: { showGrid: false },
      low: 0,
      high: maxTop5Dishes,
      chartPadding: {
        top: 0, right: 5, bottom: 0, left: 0
      }
    };
    let optionsTopTagsPlaces =  {
      axisX: { showGrid: false },
      low: 0,
      high: maxTopTagsPlaces,
      chartPadding: {
        top: 0, right: 5, bottom: 0, left: 0
      }
    };

var Chartist = require("chartist");
var delays = 80,
  durations = 500;
var delays2 = 80,
  durations2 = 500;
 
var datosT = [0, 0, 15, this.state.numReviewsTotal , 0, 0, 0];
    const dailySalesChart = {
  data: {
    labels: ["M", "T", "W", "T", "F", "S", "S"],
    series: [datosT]
  },
  options: {
    lineSmooth: Chartist.Interpolation.cardinal({
      tension: 0
    }),
    low: 0,
    high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
    chartPadding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  },
  // for animation
  animation: {
    draw: function(data) {
      if (data.type === "line" || data.type === "area") {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path
              .clone()
              .scale(1, 0)
              .translate(0, data.chartRect.height())
              .stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === "point") {
        data.element.animate({
          opacity: {
            begin: (data.index + 1) * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: "ease"
          }
        });
      }
    }
  }
};
    return (
      <div>
      <AutoSuggest suggestions={this.state.suggestions}/>
      <Grid container>
          <ItemGrid xs={12} sm={6} md={3}>
            <StatsCard
              icon={Restaurant}
              iconColor="blue"
              title="Current restaurants with reviews"
              description={this.state.numPlacesTotal}
              statIcon={Update}
              statText="real time"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={3}>
            <StatsCard
              icon={SystemUpdate}
              iconColor="green"
              title="Downloads: Android vs iOS"
              description="3 - 2"
              statIcon={Update}
              statText="Last 24 Hours"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={3}>
            <StatsCard
              icon={Map}
              iconColor="orange"
              title="Country with more usage"
              description="Colombia"
              statIcon={Update}
              statText="Last 24 Hours"
            />
          </ItemGrid>
          
          <ItemGrid xs={12} sm={6} md={3}>
            <StatsCard
              icon={Accessibility}
              iconColor="blue"
              title="Current Users"
              description={this.state.countUsers}
              statIcon={Update}
              statText="real time"
            />
          </ItemGrid>

          <ItemGrid xs={12} sm={6} md={3}>
            <StatsCard
              icon={RateReview}
              iconColor="orange"
              title="Current Reviews"
              description={this.state.numReviewsTotal}
              statIcon={Update}
              statText="real time"
            />
          </ItemGrid>

          <ItemGrid xs={12} sm={6} md={3}>
            <StatsCard
              icon={Favorite}
              iconColor="red"
              title="Average rating of reviews"
              description={descriptionReviews}
              statIcon={Update}
              statText="few minutes"
            />
          </ItemGrid>

           <ItemGrid xs={12} sm={6} md={3}>
            <StatsCard
              icon={Style}
              iconColor="blue"
              title="Most posted tag to imporve"
              description={this.state.tagToImprove}
              statIcon={Update}
              statText="few minutes"
            />
          </ItemGrid>

           <ItemGrid xs={12} sm={6} md={3}>
            <StatsCard
              icon={RestaurantMenu}
              iconColor="green"
              title="Restaurant with most reviews"
              description={this.state.tagTopRestaurant}
              statIcon={Update}
              statText="few minutes"
            />
          </ItemGrid>
        </Grid>
      <Grid container>
          <ItemGrid xs={12} sm={6} md={6}>
          <RegularCard
              headerColor="green"
              cardTitle="User Activity"
              cardSubtitle="Heat map for the locations of our users"
              content={
              <Maps
            data={this.state.dataMaps}
              />
          }
          />
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={6}>
          <Grid>
            <ItemGrid xs={12} sm={12} md={12}>
            <ChartCard
              chart={
                <ChartistGraph
                  className="ct-chart"
                  data={this.state.dailyPlaceData}
                  type="Bar"
                  options={optionsDaily}
                  responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                  listener={emailsSubscriptionChart.animation}
                />
              }
              chartColor="orange"
              title="Trending restaurants"
              text="In the last day"
              statIcon={AccessTime}
              statText={lastUpdatedDay}
            />
            </ItemGrid>
            <ItemGrid xs={12} sm={12} md={12}>
            <ChartCard
              chart={
                <ChartistGraph
                  className="ct-chart"
                  data={this.state.weeklyPlaceData}
                  type="Bar"
                  options={optionsWeekly}
                  responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                  listener={emailsSubscriptionChart.animation}
                />
              }
              chartColor="orange"
              title="Popular restaurants"
              text="In the last week"
              statIcon={AccessTime}
              statText={lastUpdatedWeek}
            />
            </ItemGrid>
          </Grid>
          </ItemGrid>
        </Grid>

        <Grid container>
          <ItemGrid xs={12} sm={6} md={6}>
            <ChartCard
              chart={
                <ChartistGraph
                  className="ct-chart"
                  data={this.state.dPlacessSortAverageRating}
                  type="Bar"
                  options={optionsDailyAvergageRating}
                  responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                  listener={emailsSubscriptionChart.animation}
                />
              }
              chartColor="blue"
              title="Best restaurants reviewed the last week"
              text="In the last week"
              statIcon={AccessTime}
              statText={lastUpdatedWeek}
            />
            </ItemGrid>

            <ItemGrid xs={12} sm={6} md={6}>
            <ChartCard
              chart={
                <ChartistGraph
                  className="ct-chart"
                  data={this.state.wPlacessSortAverageRating}
                  type="Bar"
                  options={optionsWeeklyAvergageRating}
                  responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                  listener={emailsSubscriptionChart.animation}
                />
              }
              chartColor="blue"
              title="Best restaurants reviewed the last day"
              text="In the last week"
              statIcon={AccessTime}
              statText={lastUpdatedDay}
            />
            </ItemGrid>
        </Grid>

        <Grid container>
          <ItemGrid xs={12} sm={12} md={6}>
            <RegularCard
              headerColor="purple"
              cardTitle="Trending Restaurants Info"
              cardSubtitle="Information from the most reviewed restaurants today"
              content={
                <Table
                  tableHeaderColor="warning"
                  tableHead={tableHeader}
                  tableData={tableDailyData}
                />
              }
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={6}>
            <RegularCard
              headerColor="green"
              cardTitle="Popular Restaurants Info"
              cardSubtitle="Information from the most reviewed restaurants this week"
              content={
                <Table
                  tableHeaderColor="warning"
                  tableHead={tableHeader}
                  tableData={tableWeeklyData}
                />
              }
            />
          </ItemGrid>
        </Grid>
        <Grid container>
          <ItemGrid xs={12} sm={6} md={4}>
            <ChartCard
              chart={
                <ChartistGraph
                  className="ct-chart"
                  data={dailySalesChart.data}
                  type="Line"
                  options={dailySalesChart.options}
                  listener={dailySalesChart.animation}
                />
              }
              chartColor="orange"
              title="Numbers of reviews in the last week"
              text={
                <span>
                  <span className={this.props.classes.successText}>
                    <ArrowUpward
                      className={this.props.classes.upArrowCardCategory}
                    />{" "}
                    55%
                  </span>{" "}
                  increase in last 24 reviews.
                </span>
              }
              statIcon={AccessTime}
              statText="last 24 Hours"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={4}>
            <ChartCard
              chart={
                <ChartistGraph
                  className="ct-chart"
                  data={this.state.top5dishes}
                  type="Bar"
                  options={optionsTop5Dishes}
                  responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                  listener={emailsSubscriptionChart.animation}
                />
              }
              chartColor="green"
              title="Most ordered dish"
              text="The top 5 dishes in the last week"
              statIcon={AccessTime}
              statText={lastUpdatedWeek}
            />
            </ItemGrid>
            <ItemGrid xs={12} sm={6} md={4}>
            <ChartCard
              chart={
                <ChartistGraph
                  className="ct-chart"
                  data={this.state.topTagPlaces}
                  type="Bar"
                  options={optionsTopTagsPlaces}
                  responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                  listener={emailsSubscriptionChart.animation}
                />
              }
              chartColor="blue"
              title="Rating Tags to improve"
              text="Tags that the restaurant could be improve"
              statIcon={AccessTime}
              statText={lastUpdatedWeek}
            />
            </ItemGrid>
        </Grid>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
