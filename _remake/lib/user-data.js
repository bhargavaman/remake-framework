const jsonfile = require("jsonfile");
const path = require('path');
import { showConsoleError } from "../utils/console-utils";

// create new user data files
// returns: {details, appData}
async function createUserData (passedInDetails) {

  let details;
  try {
    details = await jsonfile.readFile(path.join(__dirname, "../../project-files/_bootstrap-data/user/details.json"));
  } catch (e) {
    details = {};
  }

  // extend user details with args
  Object.assign(details, passedInDetails);

  let appData;
  try {
    appData = await jsonfile.readFile(path.join(__dirname, "../../project-files/_bootstrap-data/user/appData.json"));
  } catch (e) {
    appData = {};
  }

  let detailsWritePromise = jsonfile.writeFile(path.join(__dirname, "../../_remake-data/", `_${username}.json`), details);
  let appDataWritePromise = jsonfile.writeFile(path.join(__dirname, "../../_remake-data/", `${username}.json`), appData);

  await Promise.all([detailsWritePromise, appDataWritePromise]);

  return {details, appData};
}

// get all user data
// returns: {details, appData}
async function getUserData ({ username }) {
  try {
    let detailsPromise = jsonfile.readFile(path.join(__dirname, "../../", "_remake-data/", `_${username}.json`)); 
    let appDataPromise = jsonfile.readFile(path.join(__dirname, "../../", "_remake-data/", `${username}.json`));
    let [ details, appData ] = await Promise.all([detailsPromise, appDataPromise]);
    return { details, appData }; 
  } catch (e) {
    return null;
  }
}

// set EITHER details data OR appData data by username
// returns: {username, type, data}
async function setUserData ({ username, data, type }) {
  let detailsWritePromise;
  let appDataWritePromise;

  try {
    if (type === "details") {
      detailsWritePromise = jsonfile.writeFile(path.join(__dirname, "../../", "_remake-data/", `_${username}.json`), data);
    }
  } catch (e) {
    showConsoleError("Error: Setting user details");
  }

  try {
    if (type === "appData") {
      appDataWritePromise = jsonfile.writeFile(path.join(__dirname, "../../", "_remake-data/", `${username}.json`), data);
    }
  } catch (e) {
    showConsoleError("Error: Setting user appData");
  }

  await Promise.all([detailsWritePromise, appDataWritePromise]);

  return {username, type, data};
}

export {
  createUserData,
  getUserData,
  setUserData
}