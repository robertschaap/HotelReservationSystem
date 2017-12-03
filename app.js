//requiring all used modules, initializing express
const express = require('express');
const app = express();
const myport = process.env.PORT || 3000;

const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const bcrypt = require('bcrypt');
// const nodemailer = require('nodemailer');

//configuring and initializing modules
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use( bodyParser.urlencoded({ extended: true }) );

const sequelize = new Sequelize('reservation', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
    storage: "./session.postgres",
    logging: false
});

//SESSIONS
app.use(session({
    store: new SequelizeStore({
        db: sequelize,
        checkExpirationInterval: 30 * 60 * 1000,
        expiration: 24 * 60 * 60 * 1000,
    }),
    secret: "whatever secret for user",
    saveUninitialized: true,
    resave: false
    })
);

//MODEL CONFIGURATION
const Users = sequelize.define('users', {
    firstname: { type: Sequelize.STRING },
    lastname: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING },
    phone: { type: Sequelize.STRING },
    address: { type: Sequelize.STRING },
    passport: { type: Sequelize.STRING },
    creditcard: { type: Sequelize.STRING },
    password: { type: Sequelize.STRING }
});

// ROOM MODEL DEFINITION
const Rooms = sequelize.define('rooms', {
    roomType: { type: Sequelize.STRING },
    roomRate: { type: Sequelize.STRING },
    description:{type: Sequelize.STRING }
});

//RESERVATION BOOKING MODEL DEFINITION (JOIN TABLE)
const Bookings = sequelize.define('bookings', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    confirmationNumber: { type: Sequelize.INTEGER},
    dateCheckin: { type: Sequelize.DATE },
    dateCheckout: { type: Sequelize.DATE },
    roomType: { type: Sequelize.STRING },
    roomNumber: { type: Sequelize.STRING },
});

// TABLES RELATIONSHIP/ASSOCIATION (for Many to Many Relationship)
Users.belongsToMany(Rooms, { through: { model: Bookings, unique: false}, foreignKey: 'userId' });
Rooms.belongsToMany(Users, { through: { model: Bookings, unique: false}, foreignKey: 'roomId' });

//syncing database and manually inserting in Postgress
sequelize.sync({ force: true })
.then(() => {
    Rooms.create({ roomType: "Standard", roomRate: "250", description: "bla" })
    Rooms.create({ roomType: "Standard", roomRate: "250", description: "bla" })
    Rooms.create({ roomType: "Standard", roomRate: "250", description: "bla" })
    Rooms.create({ roomType: "Standard", roomRate: "250", description: "bla" })
})
.then(() => {
    bcrypt.hash('p', 10).then((hash) => {
        Users.create({ firstname: 'p', lastname: 'p', email: 'p', phone: 'p', address: 'p', passport: 'p', creditcard: 'p', password: hash })
    }).then(() => {
        Bookings.create({ userId:1, roomId:1, dateCheckin: "2017-12-01", dateCheckout:"2017-12-03 ", roomType:"Standard" })
        Bookings.create({ userId:1, roomId:2, dateCheckin: "2017-12-01", dateCheckout:"2017-12-03 ", roomType:"Standard" })
        Bookings.create({ userId:1, roomId:3, dateCheckin: "2017-12-01", dateCheckout:"2017-12-03 ", roomType: "Standard" })
        Bookings.create({ userId:1, roomId:3, dateCheckin: "2017-12-04", dateCheckout:"2017-12-06 ", roomType:"Standard" })
    })
    bcrypt.hash('q', 10).then((hash) => {
        Users.create({ firstname: 'q', lastname: 'q', email: 'q', phone: 'q', address: 'q', passport: 'q', creditcard: 'q', password: hash })
    })
})

//INDEX/HOME ROUTE
app.get('/', (req, res) => {
    res.render('index', {
        message: req.query.message,
        user: req.session.user
    });
});

//USERS LOGIN PAGE IS ON INDEX PAGE
app.post('/login', (req, res) => {
    if (req.body.email.length === 0) {
        res.redirect('/?message=' + encodeURIComponent("Please fill in your username."))
        return;
    }

    if (req.body.password.length === 0) {
        res.redirect('/?message=' + encodeURIComponent("Please fill in your password."))
    return;
    }

    const email = req.body.email;
    const password = req.body.password;

    Users.findOne({
        where: {
            email: req.body.email
        }
    })
    .then((user) => {
        const hash = user.password;
        bcrypt.compare(password,hash)
        .then((result) => {
            if (user !== null && password === user.password) {
                res.redirect(`/profile`);
            } else {
                //if incorrect showing error to user
                res.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
            }
        })
        .catch((error) => {
            //if any error occurs showing an invalid message to user
            console.error(error);
            res.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
        })
    })
});

//TO REGISTER ROUTE CREATING NEW USER IN DATABASE and starting session for the user and sending them to their profile
app.get('/register', (req,res) => {
    res.render('register');
})

//creating new user in database and starting session for the user and sending them to their profile
app.post('/register', (req,res) => {
    if ( req.body.password ) {
        const password = req.body.password;
        bcrypt.hash(password, 10)
        .then((hash) => {
            User.create({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
                passport: req.body.passport,
                creditcard: req.body.creditcard,
                password: hash
            })
            .then((user) => {
                req.session.user = user;
                return
            })
            .then(() => {
                res.redirect('/profile');
            })
        })
        .catch((error) => {
            console.error(error);
            res.redirect('/?message=' + encodeURIComponent('Error has occurred. Please check the server.'));
        })
    } else {
        res.render('register', { message: "The passwords don't match!" });
    };
});

app.get('/profile', (req,res) => {
    const user = req.session.user;
        if (user === undefined) {
        res.redirect('/?message=' + encodeURIComponent("Please log in"));
    } else {
        res.render('profile', { user: user });
    }
});

//ROUTE TO CHECK AVAILABILITY ROUTE
//Display availability results from post route
app.get('/availability', (req,res) => {
    res.render('availability');
})

//Search for availability and redirect to availability overview page
app.post('/availability', (req,res) => {
    const user = req.session.user;
    let arrivaldate = req.body.arrivaldate
    let departuredate = req.body.departuredate

    Rooms.findAll()
    .then((result) => {
        console.log(result)
        res.render('availability', {query: result});
    })
});

//Select a room and send to confirmation page where user checks and confirms booking to be made
app.post('/bookings', (req,res) => {
    Booking.create({
        dateCheckin: req.body.dateCheckin,
        dateCheckout: req.body.dateCheckout,
        roomType: req.body.roomType
    })
    .then((Booking) => {
        res.render('bookings');
    })
});

//ROUTE TO CONFIRMATION
//User will receive a confirmation on booking to be made, checks and confirms if ok
app.get('/confirmation', (req,res) => {
    res.render('confirmation');
});

//Creating actual booking in database
app.post('/confirmation', (req,res) => {
    Booking.create({
        dateCheckin: req.body.dateCheckin,
        dateCheckout: req.body.dateCheckout,
        roomType: req.body.roomType
    })
    .then((Booking) => {
        res.render('confirmed');
    })
});

app.listen(myport, () =>
    console.log(`Now listening on port ${myport}`)
);
