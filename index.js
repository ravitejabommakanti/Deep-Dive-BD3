const express = require('express');
const { resolve } = require('path');
const activites = require('./mockdata');
let cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('static'));

// Endpoint 1: Add an Activity
// <http://localhost:3000/activities/add?activityId=4&type=Walking&duration=20&caloriesBurned=150>

function addActivityToTheList(activityId, type, duration, caloriesBurned) {
  let activity = {
    activityId: activityId,
    type: type,
    duration: duration,
    caloriesBurned: caloriesBurned,
  };
  activites.push(activity);
  return activites;
}

app.get('/activities/add', (req, res) => {
  let activityId = parseFloat(req.query.activityId);
  let type = req.query.type;
  let duration = parseFloat(req.query.duration);
  let caloriesBurned = parseFloat(req.query.caloriesBurned);
  let activities = addActivityToTheList(
    activityId,
    type,
    duration,
    caloriesBurned
  );
  res.status(200).json({ activities });
});

// Endpoint 2: Sort Activities by Duration
// <http://localhost:3000/activities/sort-by-duration>
function sortActivitiesByProperty(property, isAscending) {
  let sortedActivities = [];
  let allAcitvites = [...activites];
  if (isAscending) {
    sortedActivities = allAcitvites.sort((a, b) => a[property] - b[property]);
  } else {
    sortedActivities = allAcitvites.sort((a, b) => b[property] - a[property]);
  }
  return sortedActivities;
}

app.get('/activities/sort-by-duration', (req, res) => {
  let activities = sortActivitiesByProperty('duration', true);
  res.status(200).json({ activities });
});

// Endpoint 3: Filter Activities by Type
// <http://localhost:3000/activities/filter-by-type?type=Running>

function filterActivitiessByPropertyAndText(property, comparisionText) {
  return activites.filter(
    (a) => a[property].toLowerCase() === comparisionText.toLowerCase()
  );
}

app.get('/activities/filter-by-type', (req, res) => {
  let filterText = req.query.type;
  let activites = filterActivitiessByPropertyAndText('type', filterText);
  res.status(200).json({ activites });
});

// Endpoint 4: Calculate Total Calories Burned
// <http://localhost:3000/activities/total-calories>
function calculateSumOfPropertiesInActivities(property) {
  return activites.reduce((accumulator, object) => {
    return accumulator + object[property];
  }, 0);
}

app.get('/activities/total-calories', (req, res) => {
  let totalCaloriesBurned =
    calculateSumOfPropertiesInActivities('caloriesBurned');
  res.status(200).json({ totalCaloriesBurned: totalCaloriesBurned });
});

//Endpoint 5: Update Activity Duration by ID
//<http://localhost:3000/activities/update-duration?activityId=1&duration=35>
function updateActivity(activityId, duration) {
  let index = activites.findIndex((obj) => obj.activityId === activityId);
  if (index != -1) {
    activites[index].duration = duration;
    return activites;
  } else {
    return [];
  }
}

app.get('/activities/update-duration', (req, res) => {
  let activityId = parseFloat(req.query.activityId);
  let duration = parseFloat(req.query.duration);
  let activities = updateActivity(activityId, duration);
  res.status(200).json({ activities });
});

// Endpoint 6: Delete Activity by ID
//<http://localhost:3000/activities/delete?activityId=2>
function deleteActivityById(activityId) {
  let index = activites.findIndex((obj) => obj.activityId === activityId);
  if (index != -1) {
    activites.splice(index, 1);
    return activites;
  } else {
    return activites;
  }
}

app.get('/activities/delete', (req, res) => {
  let activityId = parseFloat(req.query.activityId);
  let activities = deleteActivityById(activityId);
  res.status(200).json({ activities });
});

//Endpoint 7: Delete Activities by Type
// <http://localhost:3000/activities/delete-by-type?type=Running>

function deleteActivitiessByPropertyAndText(property, comparisionText) {
  return activites.filter(
    (a) => a[property].toLowerCase() !== comparisionText.toLowerCase()
  );
}

app.get('/activities/delete-by-type', (req, res) => {
  let typeValue = req.query.type;
  let activities = deleteActivitiessByPropertyAndText('type', typeValue);
  res.status(200).json({ activities });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
