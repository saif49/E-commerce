const express = require ('express')
const path = require('path')

const session = require('express-session')
const SessionStore = require('connect-mongodb-session')(session)
const flash = require('connect-flash')

const homeRouter = require('./routes/home.route')
const productRouter = require('./routes/product.route')
const authRouter = require('./routes/auth.route')
const cartRouter = require('./routes/cart.route')
const orderRouter = require('./routes/orders.route');
const adminRouter = require('./routes/admin.route')



const app = express() // pour faire l'application ou le serveur

app.use(express.static(path.join(__dirname,'assets'))) // static files
app.use(express.static(path.join(__dirname,'images'))) // static files
app.use(flash())

const STORE = new SessionStore({
   // uri : 'mongodb://localhost:27017/online-shop', //link DataBase
    uri : 'mongodb+srv://saif:cyrUpxekiOmDybiQ@cluster0.icsuz.mongodb.net/online-shop?retryWrites=true&w=majority', //link DataBase
    collection: 'sessions'
})

app.use(session({
    secret: 'this is my secret secret  to hash express session .....',
    saveUninitialized: false, //
    // cookie:{
    //     maxAge: 1*60*60*100 // hour
    // },
    store :STORE
}))
app.set('view engine','ejs')
app.set('views','views') //default

app.use('/',homeRouter)
app.use('/',authRouter)
app.use('/product',productRouter)
app.use('/cart',cartRouter)
app.use('/', orderRouter)
app.use('/admin',adminRouter)

app.get('/error', (req, res, next) => {
    res.status(500)
    res.render('error.ejs', {
        isUser: req.session.userId,
        isAdmin: req.session.isAdmin
    })
})

app.get('/not-admin', (req, res, next) => {
    res.status(403)
    res.render('not-admin.ejs', {
        isUser: req.session.userId,
        isAdmin: false
    })
})


app.use((req,res,next)=>{
    res.status(404)
    res.render('not-found',{
        isUser: req.session.userId,
        isAdmin: req.session.isAdmin,
        pageTitle: 'Page not Found'
    })
})


const port = process.env.PORT || 3000

app.listen(port,(err)=>{
    //console.log(err)
    console.log('server is running')
})