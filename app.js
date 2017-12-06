//requiring all used modules, initializing express
const express = require('express');
const app = express();
const myport = process.env.PORT || 3000;

const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const Op = Sequelize.Op;
const bcrypt = require('bcrypt');


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

// sessions
app.use(session({
    store: new SequelizeStore({
        db: sequelize,
        checkExpirationInterval: 30 * 60 * 1000,
        expiration: 24 * 60 * 60 * 1000,
    }),
    secret: "whatever secret for user",
    saveUninitialized: false,
    resave: true
}));

app.use((req, res, next) => {
    if(req.session.user) {
        res.locals.user = req.session.user;
        next();
    } else {
        next();
    }
});


// model configuration
const Users = sequelize.define('users', {
    firstname: { type: Sequelize.STRING },
    lastname: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING },
    phone: { type: Sequelize.STRING },
    address: { type: Sequelize.STRING },
    zipcode: { type: Sequelize.STRING },
    country: { type: Sequelize.STRING },
    passport: { type: Sequelize.STRING },
    roompreference: { type: Sequelize.STRING },
    creditcard: { type: Sequelize.STRING },
    password: { type: Sequelize.STRING }
});

const Rooms = sequelize.define('rooms', {
    roomType: { type: Sequelize.STRING },
    roomRate: { type: Sequelize.STRING },
    description:{ type: Sequelize.STRING },
    amount: { type: Sequelize.INTEGER }
});

const Bookings = sequelize.define('bookings', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    confirmationNumber: { type: Sequelize.INTEGER},
    dateCheckin: { type: Sequelize.DATE },
    dateCheckout: { type: Sequelize.DATE },
    roomType: { type: Sequelize.STRING },
    roomNumber: { type: Sequelize.STRING },
});

// table relationships
// future note - if join also adding data, force PK and set FKs manually or model will restrain
Users.belongsToMany(Rooms, { through: { model: Bookings, unique: false}, foreignKey: 'userId' });
Rooms.belongsToMany(Users, { through: { model: Bookings, unique: false}, foreignKey: 'roomId' });
Rooms.hasMany(Bookings);


//syncing database and manually inserting in pg
sequelize.sync({ force: true })
.then(() => {
    Rooms.create({ roomType: "Standard", roomRate: "250", amount: 4, description: "There's hardly anything standard about our rooms. Experience pure comfort in a spacious 30m2 rooms designed for your comfort." })
    Rooms.create({ roomType: "Deluxe", roomRate: "280", amount: 4, description: "Need a bit more room? Our deluxe rooms were designed to make your stay as pleasant as possible. 40m2 of space, great views and free breakfast included." })
    Rooms.create({ roomType: "Junior", roomRate: "360", amount: 4, description: "Spacious, modern and carefully layed out to make your time in our hotel as comfortable as possible. After a long day, relax in the special seating area and feel right at home. Our Junior Suites are 50m2 in size." })
    Rooms.create({ roomType: "Executive", roomRate: "500", amount: 4, description: "Our luxurious 60m2 Executive Suite offers extra space with a separate lounge as well as a working desk for our business guests. At the top floor of our hotel, the room offers an excellent view of the city." })
})
.then(() => {
    bcrypt.hash('p', 10).then((hash) => {
        Users.create({ firstname: 'p', lastname: 'p', email: 'p', phone: 'p', address: 'p', passport: 'p', creditcard: 'p', password: hash })
    }).then(() => {
        Bookings.create({ userId:1, roomId:2, dateCheckin: "2017-12-01", dateCheckout: "2017-12-03", roomType: "Deluxe" })
        Bookings.create({ userId:1, roomId:2, dateCheckin: "2017-12-01", dateCheckout: "2017-12-03", roomType: "Deluxe" })
        Bookings.create({ userId:1, roomId:2, dateCheckin: "2017-12-01", dateCheckout: "2017-12-03", roomType: "Deluxe" })
        Bookings.create({ userId:1, roomId:2, dateCheckin: "2017-12-04", dateCheckout: "2017-12-06", roomType: "Deluxe" })
        Bookings.create({ userId:1, roomId:3, dateCheckin: "2017-12-01", dateCheckout: "2017-12-03", roomType: "Junior" })
    })
    bcrypt.hash('q', 10).then((hash) => {
        Users.create({ firstname: 'q', lastname: 'q', email: 'q', phone: 'q', address: 'q', passport: 'q', creditcard: 'q', password: hash })
    })
})


// index route
app.get('/', (req, res) => {
    res.render('index', { message: req.query.message });
});

//USERS LOGIN PAGE IS ON INDEX PAGE
app.post('/login', (req, res) => {
    let useremail = req.body.email;
    let userpassword = req.body.password;

    if ( useremail && userpassword ) {
        Users.findOne({
            where: {
                email: useremail
            }
        }).then((queryresult) => {
            if (!queryresult) {
                res.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
            } else {
                return bcrypt.compare(userpassword, queryresult.password)
                .then((res) => {
                    if(res) {
                        req.session.user = queryresult;
                        return queryresult;
                    } else {
                        res.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
                    }
                })
            }
        }).then((result) => {
            if (req.session.user) {
                res.redirect('/')
            } else {
                res.redirect('/?message=' + encodeURIComponent("An error occured, please login again."));
            }
        })
    } else {
        res.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
    }
});

//TO REGISTER ROUTE CREATING NEW USER IN DATABASE and starting session for the user and sending them to their profile
// registration route: create new user, set session and redirect

app.get('/register', (req,res) => {
    res.render('register');
})

app.post('/register', (req,res) => {
const password = req.body.password;
        bcrypt.hash(password, 8)
        .then((hash) => {
            Users.create({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
                zipcode: req.body.zipcode,
                country: req.body.country,
                roompreference: req.body.roompreference,
                passport: req.body.passport,
                creditcard: req.body.creditcard,
                password: hash
            })
            .then((user) => {
                req.session.user = user;
                res.redirect('profile')
            })
        })
        .catch((error) => {
            console.log(error)
            res.redirect('/?message=' + encodeURIComponent('Error has occurred'));
        })
});

// login routing from index page
app.post('/login', (req, res) => {
    let useremail = req.body.email;
    let userpassword = req.body.password;

    if ( useremail && userpassword ) {
        Users.findOne({
            where: {
                email: useremail
            }
        }).then((queryresult) => {
            if (!queryresult) {
                res.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
            } else {
                return bcrypt.compare(userpassword, queryresult.password)
                .then((res) => {
                    if(res) {
                        req.session.user = queryresult;
                        return queryresult;
                    } else {
                        res.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
                    }
                })
            }
        }).then((result) => {
            if (req.session.user) {
                res.redirect('/')
            } else {
                res.redirect('/?message=' + encodeURIComponent("An error occured, please login again."));
            }
        })
    } else {
        res.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy( () => {
        res.redirect('/');
    });
});

// static profile page
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
// availability route
// display availability results from post route
app.get('/availability', (req,res) => {
    res.render('availability');
})

// search for availability and redirect to availability overview page
app.post('/availability', (req,res) => {
    let arrivalDate = req.body.arrivaldate
    let departureDate = req.body.departuredate

    // Find all rooms and include count of bookings on room between arrival and departure date
    Rooms.findAll({
        attributes: {
            include: [[sequelize.fn('count', sequelize.col('bookings.id')), 'bookingscount']],
        },
        include: [{
            model: Bookings,
            required: false,
            attributes: [],
            where: {
                [Op.or]: [{
                    dateCheckin: {[Op.between]: [ arrivalDate, departureDate ]}
                },{
                    dateCheckout: {[Op.between]: [ arrivalDate, departureDate ]}
                }]
            },
        }],
        group: ['rooms.id']
    })
    .then((result) => {

        // Remove redundant rows and calculate available rooms per room type
        return result.map(i => {
            let newDataValues = i.dataValues;
            newDataValues.bookingscount = Number(newDataValues.bookingscount);
            newDataValues.availability = newDataValues.amount - newDataValues.bookingscount;
            return newDataValues;
        })
    })
    .then((result) => {
        res.render('availability', { query: result, arrivalDate: arrivalDate, departureDate: departureDate });
    })
});

// select a room and send to confirmation page where user checks and confirms booking to be made
app.post('/bookings', (req,res) => {
    res.render('bookings', { arrivalDate: req.query.arr, departureDate: req.query.dep, roomType: req.query.rty, roomRate: req.query.rrt, user: req.session.user });
});

// creating actual booking in database
app.post('/confirmation', (req,res) => {
    console.log(req.query)
    Booking.create({
        dateCheckin: req.query.arr,
        dateCheckout: req.query.dep,
        roomType: req.query.rty
    })
    .then((Booking) => {
        res.render('confirmation');
    })
});

app.listen(myport, () =>
    console.log(`Now listening on port ${myport}`)
);
