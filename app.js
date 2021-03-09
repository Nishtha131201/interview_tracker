const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const run = require('./admin/connection');
const authController = require('./controllers/authController');
const Quest = require('./models/question');
const {reqAdminAuth} = require('./middleware/authAdmin');
const bodyParser = require('body-parser');


const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// const express = require('express');
const {default : AdminBro} = require('admin-bro');
// const mongoose = require('mongoose');
const buildAdminRouter = require('./admin/admin.router');
const options = require('./admin/admin.options');
// const app = express();
const port = 3000;
// const url = 'mongodb://localhost:27017/MyProject';
// view engine
app.set('view engine', 'ejs');

const dbURI = 'mongodb+srv://nishtha:nishtha13@cluster0.nbw5b.mongodb.net/node-auth';
const url = 'mongodb://localhost:27017/MyProject';
let mongooseDb;
const databaseConnect = async () => {
  mongooseDb = await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log("we are connected to database");
  });
  
    const admin = new AdminBro(options)
    const router = buildAdminRouter(admin);
    app.use(admin.options.rootPath, router);
  
};
databaseConnect();

// routes
app.all('*', checkUser);
app.get('/admin', reqAdminAuth);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.get('/topics', requireAuth, authController.get_topics);
// app.get('/topics/:id', requireAuth, authController.get_question_by_topics);
app.get('/topics/:id', requireAuth, authController.get_question_by_topicsName);
// app.get('/questions/:id', requireAuth, authController.get_question_by_id);
app.get('/questions/:name', requireAuth, authController.get_question_by_name);
// app.get('/topics/:id', requireAuth, authController.get_question_by_id);
app.get('/error', (req, res) => res.render('error'));
app.get('/form', requireAuth, authController.form_get);
app.post('/form', requireAuth, authController.form_post);
app.get('/interviews', requireAuth, authController.interview_get);
app.get('/temp',requireAuth, (req, res) => res.render('temp'));
app.use(authRoutes);



// app.use()
app.get('/add_experience', requireAuth, authController.add_experience);
app.get('/interviews/:name', requireAuth, authController.show_experience);
app.post('/add_experience', requireAuth, authController.add_experience_post);
app.get('/:name/:id', requireAuth, authController.get_full_story);
// -----------Image-Processing-----------
const imageController = require('./controllers/imageController');
app.use(imageController);
