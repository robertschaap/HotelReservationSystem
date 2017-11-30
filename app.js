//requiring all used modules, initializing express
const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

//configuring and initializing modules
const app = express();
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
const sequelize = new Sequelize('reservation', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
    storage: "./session.postgres"
});
app.use(session({
    secret: "whatever secret for user",
    saveUninitialized: true,
    resave: false,
    proxy: true,
    store: new SequelizeStore({
        db: sequelize
    })
}));

//USER MODEL DEFINITION
const User = sequelize.define('users', {
    firstname: { type: Sequelize.STRING, notNull: false },
    lastname: { type: Sequelize.STRING, notNull: false },
    email: { type: Sequelize.STRING, unique: false },
    phone: { type: Sequelize.STRING, notNull: false },
    address: { type: Sequelize.STRING, notNull: false },
    passport: { type: Sequelize.STRING, notNull: false },
    creditcard: { type: Sequelize.STRING, notNull: false },
    password: { type: Sequelize.STRING },
}, {
    timestamps: true
});

// ROOM MODEL DEFINITION
const Rooms = sequelize.define('rooms', {
    roomNumber: { type: Sequelize.STRING, unique: false },
    roomType: { type: Sequelize.STRING, notNull: false },
    roomPreference: { type: Sequelize.STRING, notNull: false },
    bedPreference: { type: Sequelize.STRING, notNull: false },
    roomRate: { type: Sequelize.STRING, notNull: false },
}, {
    timestamps: false
});


//RESERVATION BOOKING MODEL DEFINITION
const Bookings = sequelize.define('bookings', {
    confirmationNumber: { type: Sequelize.INTEGER,
    primaryKey: false,
    autoIncrement: false },
    userId: { type: Sequelize.STRING, unique: false },
    dateBooked: { type: Sequelize.DATE, default: Date },
    dateCheckin: { type: Sequelize.DATE, notNull: false },
    dateCheckout: { type: Sequelize.DATE, notNull: false },
    roomType: { type: Sequelize.STRING, notNull: false },
    roomNumber: { type: Sequelize.STRING, unique: false },
}, {
    timestamps: false
});


// TABLES RELATIONSHIP/ASSOCIATION (for Many to Many Relationship)

User.belongsToMany(Rooms, { through: Bookings })
Rooms.belongsToMany(User, { through: Bookings })

//syncing models
sequelize.sync({force: false});

//INDEX/HOME ROUTE
app.get('/', (req, res) => {
  res.render('index', {
    message: req.query.message,
    user: req.session.user
  });
});

//USERS LOGIN PAGE + VERIFICATION CODE
app.post('/login', (req, res) => {
  // console.log("req.body.password: " + req.body.password)
  if (req.body.email.length === 0) {
    res.redirect('/?message=' + encodeURIComponent("Please fill in your username."))
    return;                                                //checking if user has filled in both fields
  }
  if (req.body.email.length === 0) {
    res.redirect('/?message=' + encodeURIComponent("Please fill in your password."))
    return;
  }
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({
    where: {
      email: email  //verifying if user exists
    }
  })
  .then((user) => {
    if (user !== null && password === user.password) {
      req.session.user = user;
      res.redirect(`/users/${user.lastname}`);          //if they exist and info is correct, start session for user
    } else {
      res.redirect('/?message=' + encodeURIComponent("Invalid email or password.")); //if incorrect showing error to user
    }
  })
  .catch((error) => {
    console.error(error);           //if any error occurs showing an invalid message to user
    res.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
  });
});


//TO REGISTER ROUTE CREATING NEW USER IN DATABASE and starting session for the user and sending them to their profile
app.get('/register', (req,res) => {
  res.render('register');
})

//creating new user in database and starting session for the user and sending them to their profile
app.post('/register', (req,res) => {
  User.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    passport: req.body.passport,
    creditcard: req.body.creditcard,
    password: req.body.password
  })
  .then((user) => {
    req.session.user = user;
    res.redirect(`/users/${user.username}`)
  })
});

//go to the user profile page with dynamic route, it will show the user's username
app.get('/users/:username', (req,res) => {
  const user = req.session.user;
  if (user === undefined) {
    res.redirect('/?message=' + encodeURIComponent("Please log in"));
  } else {
    res.render('profile', {
      user: user
    })
  }
});


//ROUTE TO CHECK AVAILABILITY ROUTE
//User will make will check availabilty
app.get('/availability', (req,res) => {
  res.render('availability');
})

//creating new user in database and starting session for the user and sending them to their profile
app.post('/availability', (req,res) => {
  User.create({
    dateBooked: req.body.dateBooked,
    dateCheckin: req.body.dateCheckin,
    dateCheckout: req.body.dateCheckout,
    roomType: req.body.roomType,
    roomNumber: req.body.roomNumber,
  }).then(() => {
    res.render('bookings');
  })
});

//   .then((user) => {
//     req.session.user = user;
//     res.redirect(`/users/${user.bookings}`)
//   })
// });

app.get('/confirmation', (req,res) => {
  res.render('confirmation');
})

app.post('/confirmation', (req,res) => {
  res.redirect('/bookings');
})


//TO BOOKINGS ROUTE CREATING NEW USER IN DATABASE and starting session for the user and sending them to their profile
app.get('/bookings', (req,res) => {
  res.render('bookings');
})

//creating new reservation in database and starting session for the user and sending them to their profile
app.post('/bookings', (req,res) => {
  User.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    passport: req.body.passport,
    creditcard: req.body.creditcard,
    password: req.body.password
  })
  .then((user) => {
    req.session.user = user;
  })
});


const server = app.listen(3000, () => {
    console.log('Example app listening on port: ' + server.address().port);
})
