# ShopEase - Fullstack MERN E-Commerce Platform

Hey! I'm Fred from Nairobi. 👋 This is ShopEase, an e-commerce platform I built while trying to master the MERN stack (MongoDB, Express, React, Node.js). 

## 📸 Preview
![ShopEase Screenshot](screenshots/preview.png)

## Why I built this
I needed a project to figure out how cart state, user authentication (JWTs), and checkout flows actually work under the hood. Honestly, the hardest part was getting the global state working smoothly and making sure the cart doesn't lose items when you refresh the page.

## Features
- User Auth (Login/Register with JWT)
- Shopping Cart functionality 
- Admin Dashboard to manage products and see orders
- Checkout flow

## Tech Stack
- **Frontend:** React, Vite, some custom CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB (using Mongoose)

## Known Issues (Things I'm still fixing lol)
- **M-Pesa Integration:** I haven't fully hooked up the Safaricom M-Pesa Daraja API for STK push yet. Right now it just assumes payment is made via COD. I'm actively working on this!
- **Mobile Navbar:** The hamburger menu occasionally glitches if you resize the window too fast. 
- **Pagination:** The admin panel loads all orders at once. If this gets huge, it's gonna crash. I'll add pagination eventually.

## Setup Instructions

If you wanna run this locally, clone the repo and do the following:

1. CD into the `shopease-backend` folder and run `npm install`
2. Create a `.env` file with your `MONGO_URI` and `JWT_SECRET`
3. CD into `shopease-frontend` and run `npm install`
4. Open two terminals, run `npm run dev` in the frontend and backend.

## Peace! ✌️
Feel free to open an issue or hit me up if you have questions.
