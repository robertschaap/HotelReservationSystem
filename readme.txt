NYCDA Group Project

In a block, answer the following questions:
- What is the problem you are trying to solve?
We want to provide a real time room availability when user make a reservation online base on avaialable rooms in database 

- Who is your target audience?
Start-up hotels in out skirt of Amsterdam City Center/ or any new hotel that need basic website and automation in reservation and database

- What are your specific goals?
- To create a reservation database 
- A landing homepage for the client that features all the hotel facility in one page
- A navigation bar that allows the user to traverse and  to different facilities in the  - hotel such us Food and Beverages
-User can reserve a room once they click the availabilty
-Registration page that allows the guest to become a member
-Login page for returning user's 


In another block, answer the following:
- What is your business model? Where is your revenue coming from?
- Direct Sales model Room 
- Revenues are from room reservation and Food and Beverages

- What are the costs of your business?
Server space, hosting, database maintenance/updating and time. Storage for online and walk-in reservation

Market research:
- Who is your current competition?
In analysing the hotel supply, it is necessary to distinguish between Amsterdam and the rest of the Netherlands. In the rest of the Netherlands, the number of hotel rooms has grown by around 4% in the past four years, whereas the number of guests has risen by 21% Because demand grew faster than supply, hotels were fuller (see us for factualy market reseach and figures)


- How is your product different from currently available competitors?
  By service scale / quality
  By geographical location and accessibility
  By event organizing capacity
  By total number of rooms to welcome large groups

- What is the current supply / demand for your product?
The increase in tourist numbers has pushed up hotel the deman of the hotel in this country
	
 
 Technical Specifications:
- What data will you need to store? How will it be organized? Describe each table, its columns, and its relationships with other tables.
RELATIONAL DATABASE
Users.belongsToMany(Rooms, { through: { model: Bookings, unique: false}, foreignKey: 'userId' });
Rooms.belongsToMany(Users, { through: { model: Bookings, unique: false}, foreignKey: 'roomId' });
Rooms.hasMany(Bookings);

- What does your product look like? List each view, their purpose, and how they work
 Homepage with login and registration form in the same page
 Availibility room page thats feautures the available to reserves
 Tpes of room page and its description and prices
 Food and Beverage page for Wine and dine
 Profile Page
 About us page that features hotel location and contact details
 A confirmation page

- Describe any complex business logic that is happening in your application. 
- For example, how does data flow through your application 
  We are using the paypal api for payments. 
  User login, or register, then user can check the room availabilty then move to room reservation and final is confirmation page

-Have a timeline of milestones to reach, including deadlines:
-Create milestones that represent the discrete blocks of  functionality.
 Users are able to register, login, logout
 User info is unique, validated, and secure/encrypted
 Booking items are all set into database + images can be shown
 All pages styling and content is finalized.
 User is able to send items to shopping cart
 User items are all set into database + images can be shown
 Users are able to access and modify shopping cart
 Paypal is integrated (test version) into shop
 User can use paypal to pay
 Send emails to users after purchase (bonus!)
 Git master

- Give an estimate for how long each will take per engineer.
Robert: 3,4 days
Mary: 7,8, 9, two days

- Determine whether things can be built concurrently.
  we can each do our own things separately and thus concurrently
  Come up with a timeline of goals to stick to.
  finish everything by ???
