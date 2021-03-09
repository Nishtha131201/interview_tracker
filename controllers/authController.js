const User = require("../models/User");
const jwt = require('jsonwebtoken');
const Quest = require('../models/question');
const Topics = require('../models/topics');
const Topic = require("../models/topics");
const { Query } = require("mongoose");
const {isAdmin} = require('../middleware/authAdmin');
const app = require('../app');


// handle errors

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'net ninja secret', {
    expiresIn: maxAge
  });
};

// controller actions
module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.form_get = async (req, res) => {
  const filter = {};
  const all = await Topic.find(filter);
  res.render('forms', {topics : all});
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.form_post = async (req, res) => {
  const {name, topic, link} = req.body;
  const approved = isAdmin(req, res);
  var topicId;
  await Topic.find({name : topic}).then((result) => topicId = result[0]._id);
  console.log("name : ", name, topic, link, approved);
  try {
    const quest = await Quest.create({topic : topicId, name, link, approved});
    res.status(201).json({quest : quest._id});
  }
  catch(err) {
    console.log(err);
    res.status(401).json({err});
  }
}

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  var redirect_to = '/';
  try {
    if (res.app.locals && res.app.locals.redirect_to) redirect_to = res.app.locals.redirect_to;
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id, redirect_to });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  var redirect_to = '/';
  try {
    if (res.app.locals && res.app.locals.redirect_to) redirect_to = res.app.locals.redirect_to;
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id, redirect_to});
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors, redirect_to });
  }

}

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}

module.exports.get_topics = (req, res) => {
  Topics.find().then((result) => {res.render('topics', {topics : result})})
  .catch((err) => console.log(err));
}


module.exports.get_question_by_name = (req, res) => {
  const name = req.params.name;
  let id;
  console.log("name ," ,name);
  Quest.find({name : name}).then((result) => {
    res.redirect(result[0].link);
  })
 
}

module.exports.get_question_by_topicsName = async (req, res) => {
  const id = req.params.id;
  console.log("id = ", id);
  var TopicId = 23, iconName;
  console.log(TopicId);
  await Topic.find({name : id}).then((result) =>  {TopicId = result[0]._id; iconName = result[0].iconName});
  console.log("Id = ", TopicId);
  Quest.find({topic : TopicId}).then((result) => {
    console.log("questions : ", result);
    res.render('all_questions', {questions : result, iconName});
  })
  .catch((error) => console.log(error));
  // Quest.find({name : 'Array Sum'}).then((result) => console.log("result : ", result));
  // Quest.find({topic : id}).then((result) => console.log("Abe ab kyu nahi aa rha ", result, id));

}

// ----------InterviwLogic----------------------------------
const Company = require('../models/Company');
const Experience = require('../models/experience');

module.exports.interview_get = async (req, res) => {

  await Company.find({}, (err, item) => {
    if (err){
        console.log(err);
    }
    else {
        res.render('interview/home', {items : item});
    }
}).catch((err) => console.log("erro = ", err));

}

module.exports.company_get = async (req, res) => {
  const result = await Company.find({});
  res.render('interview/company', {companiess : result});
}

module.exports.user_updation_get = (req, res) => {
  res.render('interview/userUpdation');
}

module.exports.experience_get = (req, res) => {
  res.render('interview/experience');
}
module.exports.add_experience = (req, res) => {
  const branches = ['CSE', 'MNC', 'ECE', 'EE', 'CST', 'EP', 'MT', 'CE', 'BT'];
  Company.find({}).then(result => res.render('interview/add_experience', {companies : result, branches}));
}
module.exports.add_experience_post = async (req, res) => {

  const {year, branch, company, experience} = req.body;
  const user = res.locals.user;
  const approved = isAdmin(req, res);
  var companyId = await Company.find({name : company});
  companyId = companyId[0]._id;
  var obj = {user, year, branch, company : companyId, experience, approved};
  try {
    const exper = await Experience.create(obj);
    console.log("exper : ", exper);
    res.redirect('/');
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}
module.exports.show_experience = async (req, res) => {
  let name = req.params.name;
  let allUser = new Array();
  let company = await Company.find({name : name});
  const allExperience = await Experience.find({company : company[0]._id, approved : true});
  // console.log("allExperience : ", allExperience);
  for (let i = 0; i < allExperience.length ; i++) {
    if (allExperience[i].approved) {
      let user = await User.findById(allExperience[i].user);
      // console.log("user = ", user);
      allUser.push(user);
    }
  }
  console.log("org url : ", req.originalUrl);
  res.render('interview/show_experiences',{experiences : allExperience, company: company[0], allUser})
}

module.exports.get_full_story = async (req, res) => {
  let name = req.params.name;
  const id = req.params.id;
  let allUser = new Array();
  let company = await Company.find({name : name});
  const allExperience = await Experience.find({_id : id});
  for (let i = 0; i < allExperience.length ; i++) {
    if (allExperience[i].approved) {
      let user = await User.findById(allExperience[i].user);
      // console.log("user = ", user);
      allUser.push(user);
    }
  }
  // console.log("org url : ", req.originalUrl);
  res.render('interview/full_story',{experiences : allExperience, company: company[0], allUser})
 
  
}