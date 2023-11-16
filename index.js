//global consts, etc. 
const API = "http://localhost:3000/activities"
let activitiesArr = []
let currentFavoriteArr = []
let allFavoritesArr = []
const activitiesCollection = document.getElementById('activity-collection');
const favoritesCollection = document.getElementById('favorites-list');
document.getElementById('new-activity-button').addEventListener('click', () =>renderActivities(activitiesArr));
document.getElementById('add-activity-form').addEventListener('submit', newActivity);


//pull activities from db and render random one onto page
fetch(API)
.then(res => res.json())
.then(activities => {
    activitiesArr = activities 
    renderActivities(activities)
})


function renderActivities(activities) {
    activitiesCollection.innerHTML = ""
    let randomNumber = Math.floor(Math.random () * activitiesArr.length)
    createCard(activities[randomNumber])
}

function createCard(activity) {
    activitiesCollection.classList = 'card'
    activitiesCollection.innerHTML = `
        <h2>${activity.name}<h2>
        <img class = 'img' src='${activity.image}' />
        <p class = 'small-text'>${activity.description}</p>
        <button class = 'btn' id = 'activity-${activity.id}'>Reccomend &#x2764;</button>
    `
    const recommendationBtn = document.getElementById(`activity-${activity.id}`)
    recommendationBtn.addEventListener('click', () => handleRecommendations(activity))
}

//user recommendation list
fetch(API)
.then(res => res.json())
.then(activities => {
    renderUserRecommendations(activities)
})

function renderUserRecommendations(activities) {
    activities.forEach(createRecommendation)
}

function createRecommendation(activity) {
    const newRecommendation = document.createElement('div');
    newRecommendation.id = activity.id
    newRecommendation.classList = 'recommendation-list'
    newRecommendation.textContent = `${activity.recommendations} users recommend ${activity.name}`
    if (activity.recommendations > 0) {
        favoritesCollection.append(newRecommendation);
    }
}

function handleRecommendations (activity) {
    let recommendations = activity.recommendations + 1
    fetch (`${API}/${activity.id}`, {
        method: 'PATCH',
        headers: 
        {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({recommendations})
    })
    .then (res => res.json())
    .then (() => {
        activity.recommendations = recommendations
        const recommendation = document.getElementById(activity.id)
        if(recommendation){
            recommendation.textContent =  `${activity.recommendations} users recommend ${activity.name}`
        } else {
            createRecommendation(activity)
        }
    })
}

//adds new activity to database
function newActivity(e) {
    e.preventDefault()
    const newActivityItem = {
        name: e.target.name.value,
        image: e.target.image.value,
        description: e.target.description.value
    }
    if (newActivityItem.name === "") {
        alert('Please add activity name!')
    }
    else if (newActivityItem.description === "") {
        alert('Please add activity description!')
    }
    else {
        fetch(API, {
            method: 'POST',
            headers:
            {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: JSON.stringify(newActivityItem)
        })
        .then(res => res.json())
        .then(data => {
            activitiesArr.push(data)
            alert('Activity added!')
        })
        e.target.reset()
    }
}

//adds final event listener to new activity button 
const newActivityBtn = document.getElementById('new-activity-button')
newActivityBtn.addEventListener('mouseover', handleMouseOver);

function handleMouseOver(e) {
    newActivityBtn.style.background = "linear-gradient(135deg, #ffd8b1, #ff590f)"
}

newActivityBtn.addEventListener('mouseout', handleMouseOut);

function handleMouseOut() {
    newActivityBtn.style.background = "linear-gradient(135deg, #ff590f, #ff27a4)"
}