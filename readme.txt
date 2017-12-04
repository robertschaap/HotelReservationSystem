NYCDA Group Project

In a block, answer the following questions:
- What is the problem you are trying to solve?
We want to provide a real time room availability when user make a reservation base on avaialable rooms in database thats matches the hotel room capacity 

- Who is your target audience?
Start-up hotels in out skirt of Amsterdam City Center/ or any new hotel that need basic website and automation in reservation and database

- What are your specific goals?
- To create a 
-Home Page ()
-Booking of Rooms (forms)
-Registration of User if gust want to become a member(form)
-Login of User if user is returning client (form)
-Gallery of Rooms (Photos with discription 

In another block, answer the following:
- What is your business model? Where is your revenue coming from?
Room reservation sales Shop

- What are the costs of your business?
Server space, hosting, database maintenance/updating and time. Storage for online and walk-in reservation

Market research:
- Who is your current competition?
Every game shop ever. But oh well.

- How is your product different from currently available competitors?
Our shop focusses on the best game character ever made,

- What is the current supply / demand for your product?
The increase in tourist numbers has pushed up hotel prices by 13% in the last two years. In the same period, the price level of goods and services rose by less than 1% overall in the Netherlands.
The increase in tourist numbers has pushed up hotel prices by 13% in the last two years (CBS). In the same period, the price level of goods and services rose by less than 1% overall in the Netherlands.
In analysing the hotel supply, it is necessary to distinguish between Amsterdam and the rest of the Netherlands. In the rest of the Netherlands, the number of hotel rooms has grown by around 4% in the past four years, whereas the number of guests has risen by 21% (see Table 1). Because demand grew faster than supply, hotels were fuller

	



Technical Specifications:
- What data will you need to store? How will it be organized? Describe each table, its columns, and its relationships with other tables.
Data:
Product information
Users and user information (plus playments information). Purchase history + game keys for steam/gog
Tables:
Users (first name, last name, email, username,  password)
Products (name, price, description, image url)
Keys
Purchases (userid, products, amount)

- What does your product look like? List each view, their purpose, and how they work
Homepage (login screen), Store page, User profile (purchase history, profile info, game keys of purchased games), Shopping Cart, Checkout + payments.

- Describe any complex business logic that is happening in your application. For example, how does data flow through your application 
We are using the paypal api for payments. 
User login, put items in their shopping cart, they can then open the shopping cart and checkout using paypal.

Have a timeline of milestones to reach, including deadlines:
- Create milestones that represent the discrete blocks of  functionality.
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
Robert: 3, two days
Mary: 7,8, 9, two days

- Determine whether things can be built concurrently.
	- we can each do our own things separately and thus concurrently
- Come up with a timeline of goals to stick to.
- finish everything by ???
