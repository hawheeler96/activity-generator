//global consts, etc. 
const API = "http://localhost:3000/activities"
let activitiesArr = []
const activitiesCollection = document.getElementById('activity-collection');
document.getElementById('new-activity-button').addEventListener('click', () =>renderActivities(activitiesArr));
document.getElementById('add-activity-form').addEventListener('submit', newActivity)


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
        <p>${activity.description}</p>
    `
}

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
    else if (newActivityItem.image === "") {
        alert('Please add activity image!')
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