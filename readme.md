NYCDA Group Project

In a block, answer the following questions:
- What is the problem you are trying to solve?
We want to provide a real time room availability when user make a reservation online base on avaialable rooms in database 

- Who is your target audience?
Start-up hotels in out skirt of Amsterdam City Center or any new hotel that need basic website and automation in reservation and database

- What are your specific goals?
- To create a reservation database 
- A landing homepage for the client that features all the hotel facility in one page
- A navigation bar that allows the user to traverse to different facilities in the hotel such as Food and Beverages
- User can reserve a room once they click the availabilty and confirm
- Registration page that allows the guest to become a member
- Login page for returning users 


In another block, answer the following:
- What is your business model? Where is your revenue coming from?
- Direct sales of the room reservation system to the hotels.
- Revenues for the hotels themselves will come from being able to book easier and direct vs. having to go through Booking/Hotels/Priceline

- What are the costs of your business?
Server space, hosting, database maintenance/updating and time, which will be passed on to the clients.
On our end sales staff and related costs.

Market research:
- Who is your current competition?
In analysing the hotel supply, it is necessary to distinguish between Amsterdam and the rest of the Netherlands. In the rest of the Netherlands, the number of hotel rooms has grown by around 4% in the past four years, whereas the number of guests has risen by 21% Because demand grew faster than supply, hotels were fuller (see us for factualy market reseach and figures). src: ABN Amro Tourism Research

- How is your product different from currently available competitors?
  By service scale / quality
  By geographical location and accessibility
  By event organizing capacity
  By total number of rooms to welcome large groups

- What is the current supply / demand for your product?
The increase in tourist numbers has pushed up hotel the deman of the hotel in this country. Many smaller hotels have no good automated systems of their own and are able to take reservations only through telephone or platforms like Booking/Hotels/Priceline which take substantial commissions.
	
 
 Technical Specifications:
- What data will you need to store? How will it be organized? Describe each table, its columns, and its relationships with other tables.
RELATIONAL DATABASE (see app.js from line 48 - models have not changed since prototype)
Users.belongsToMany(Rooms, { through: { model: Bookings, unique: false}, foreignKey: 'userId' });
Rooms.belongsToMany(Users, { through: { model: Bookings, unique: false}, foreignKey: 'roomId' });
Rooms.hasMany(Bookings);

- What does your product look like? List each view, their purpose, and how they work
 - Homepage with login and registration form in the same page. Also on homepage are descriptions of rooms, dinner options and about us/contact details
 - Availibility room page that features available room types and actual number available
 - Profile Page
 - Confirmation page asking user to confirm booking and subsequent page confirming the actual reservation

- Describe any complex business logic that is happening in your application. 
- For example, how does data flow through your application
 - User can register an account which pushes data to the database.
 - After register or upon login, user data is validated and sessions are set.
 - User can check room availability which queries all room types and checks them against existing bookings. The result is the amount of available rooms per room type.
 - User confirmation of booking creates an entry in the database.

-Have a timeline of milestones to reach, including deadlines:
-Create milestones that represent the discrete blocks of functionality.
 - NOV-23 Project scoping
 - NOV-28 Project start
 - DEC-01 Conceptual layout of home page, table layout and basic routing
 - DEC-05 Core features implemented
 - DEC-06 Bug fixes and final additions

- Give an estimate for how long each will take per engineer.
Robert - Lead Front-End Developer: 4 days, 2 days back-end support
Mary - Lead Back-End Developer & Database Engineer: 6 days

- Determine whether things can be built concurrently.
Front-end and  back-end can be built separately for the majority of the project. We implemented a separate pug file with all forms on it so there was one place for routing to back-end to be tested.
