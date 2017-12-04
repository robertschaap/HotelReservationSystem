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
    saveUninitialized: false,
    resave: true
}));


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
    description:{ type: Sequelize.STRING },
    amount: { type: Sequelize.INTEGER }
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
// Future note - if join also adding data, force PK and set FKs manually or model will restrain
Users.belongsToMany(Rooms, { through: { model: Bookings, unique: false}, foreignKey: 'userId' });
Rooms.belongsToMany(Users, { through: { model: Bookings, unique: false}, foreignKey: 'roomId' });
Rooms.hasMany(Bookings);


//syncing database and manually inserting in Postgress
sequelize.sync({ force: true })
.then(() => {
    Rooms.create({ roomType: "Standard", roomRate: "250", amount: 4, description: "There's hardly anything standard about our rooms. Experience pure comfort in a spacious 30m2 rooms designed for your comfort." })
    Rooms.create({ roomType: "Deluxe", roomRate: "250", amount: 4, description: "Need a bit more room? Our deluxe rooms were designed to make your stay as pleasant as possible. 40m2 of space, great views and free breakfast included." })
    Rooms.create({ roomType: "Junior", roomRate: "250", amount: 4, description: "Spacious, modern and carefully layed out to make your time in our hotel as comfortable as possible. After a long day, relax in the special seating area and feel right at home. Our Junior Suites are 50m2 in size." })
    Rooms.create({ roomType: "Executive", roomRate: "250", amount: 4, description: "Our luxurious 60m2 Executive Suite offers extra space with a separate lounge as well as a working desk for our business guests. At the top floor of our hotel, the room offers an excellent view of the city." })
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


//INDEX/HOME ROUTE
app.get('/', (req, res) => {
    res.render('index');
});

//USERS LOGIN PAGE IS ON INDEX PAGE
app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if ( email && password ) {
        Users.findOne({
            where: {
                email: req.body.email
            }
        })
        .then((user) => {
            if (user) {
                const hash = user.password;
                bcrypt.compare(password,hash)
                .then ((result) => {
                    if (!result) {
                        res.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
                        return
                    } else {
                        req.session.user = user;
                    }
                })
                .then((result) => {
                    console.log('the result')
                    console.log(result)
                    res.redirect('/profile');
                })
            } else {
                res.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
            }
        })
    } else {
        res.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
    }
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
            res.redirect('/?message=' + encodeURIComponent('Error has occurred. Please check the server.'));
        })
    } else {
        res.render('register', { message: "The passwords don't match!" });
    };
});

app.get('/profile', (req,res) => {
    res.render('profile', { user: req.session.user });
});

//ROUTE TO CHECK AVAILABILITY ROUTE
//Display availability results from post route
app.get('/availability', (req,res) => {
    res.render('availability');
})

//Search for availability and redirect to availability overview page
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

//Select a room and send to confirmation page where user checks and confirms booking to be made
app.post('/bookings', (req,res) => {
        res.render('bookings', { arrivalDate: req.body.arr, departureDate: req.body.dep, roomType: req.body.rty });
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
