const express = require('express')
const app = express()
const mongoose = require('mongoose')
const shortUrl = require('./models/shortUrl')

mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
    const shortUrls = await shortUrl.find();
    res.render('index', { shortUrls: shortUrls });
});

app.post('/shortUrls', async (req, res) => {
    await shortUrl.create({ full: req.body.fullUrl });
    res.redirect('/');
});
app.post('/delete/:id', async (req, res) => {
    try {
        await shortUrl.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (error) {
        console.error("Error deleting URL:", error);
        res.sendStatus(500); // Internal Server Error
    }
});


app.get('/:shortUrl', async (req, res) => {
    const foundShortUrl = await shortUrl.findOne({ short: req.params.shortUrl });
    if (!foundShortUrl) return res.sendStatus(404);

    foundShortUrl.clicks++;
    await foundShortUrl.save();

    res.redirect(foundShortUrl.full);
});


app.listen(process.env.PORT || 5000);
