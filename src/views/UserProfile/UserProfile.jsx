import React, {Component} from "react";
import { Grid, InputLabel } from "material-ui";
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
  RestaurantMenu
} from "@material-ui/icons";
import {
  ProfileCard,
  StatsCard,
  RegularCard,
  Button,
  CustomInput,
  ItemGrid,
  ChartCard,
} from "components";
import {emailsSubscriptionChart} from "variables/charts";

import avatar from "assets/img/avatar-placeholder.png";

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user:{},
      topDishes:[],
      topDishesData:{},
      topRatedDishes:[],
      topRatedDishesData:{}
    }
  }
  


 getPlatosMasPedidos(firestore){
    let userRef = firestore.collection("users");
    let user = {};
    userRef.doc(this.props.match.params.id).get()
    .then(querySnapshot=> {
      let user = querySnapshot.data();
      this.setState({user:user})
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
    let optionsDishes = Object.assign({},options);;

    optionsDishes.high = this.state.topDishesData.series ? Math.max.apply(null, this.state.topDishesData.series[0])+0.5 : 5;
    let friendsCount = this.state.user.friendCount != undefined ? "Friends: " + this.state.user.friendCount + "  " : ""
    let reviewsCount = this.state.user.reviewsCount != undefined ? "Reviews: " + this.state.user.reviewCount : ""
    
    let descriptionReviews = this.state.user.ratingAverage ? this.state.user.ratingAverage.toFixed(2) +"/5.0" : "0/5.0"
    let descriptionFriendsCount = this.state.user.friendCount != undefined ? this.state.user.friendCount : ""
    let descriptionReviewsCount = this.state.user.reviewCount != undefined ?  this.state.user.reviewCount : ""
    let favoriteDish = this.state.topDishes && this.state.topDishes[0] ? this.state.topDishes[0].name : ""
    let mostReviewedDish = this.state.topRatedDishes && this.state.topRatedDishes[0] ? this.state.topRatedDishes[0].name : ""
    let descriptionUser = "Favorite Dish: "+ favoriteDish + ". \n"+ "Most reviewed dish: " + mostReviewedDish;
  return (
    <div>
      <Grid container>
      <ItemGrid xs={12} sm={12} md={6}>
          <ProfileCard
            avatar={this.state.user.photoURL ? this.state.user.photoURL : avatar}
            title={this.state.user.username}
            subtitle={this.state.user.email}
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
              icon={Group}
              iconColor="orange"
              title="Friends"
              description={descriptionFriendsCount}
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
              icon={RestaurantMenu}
              iconColor="orange"
              title="Favorite Dish"
              description={favoriteDish}
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
                  options={options}
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
      </Grid>       
    </div>
  );
  }
} 

export default UserProfile;
