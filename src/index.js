const express = require('express');
const serverConfig = require('./config/server.config');
const connectDB = require('./config/db.config');
const bookRoutes = require("./routes/book.routes");
const userRouter = require("./routes/user.routes");
const categoryRouter = require("./routes/category.routes");
const wishlistRoutes = require("./routes/wishlist.routes");
const chapterRouter = require("./routes/chapter.routes");
const cors = require("cors");
const cartRouter = require("./routes/cart.routes");
const notesRouter = require("./routes/notes.routes");
const highlightRouter = require("./routes/highlight.routes");
const orderRouter = require("./routes/order.routes");
const progressRouter = require("./routes/progress.routes");
const bookmarkRouter = require("./routes/bookmark.routes");
const ratingRouter =  require("./routes/rating.routes");


const app = express();

app.use(cors({
    origin: ["https://epustakalay.netlify.app", "http://localhost:5173"],
    credentials: true,
    methods: 'GET,POST,PUT,PATCH,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/books", bookRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart",cartRouter);
app.use("/api/chapters", chapterRouter);
app.use("/api/notes", notesRouter);
app.use("/api/highlights", highlightRouter);
app.use("/api/orders", orderRouter);
app.use("/api/progress", progressRouter);
app.use("/api/bookmarks", bookmarkRouter);
app.use("/api/ratings",ratingRouter);

app.get('/ping', (req, res) => {
    res.send('pong');
});

app.listen(serverConfig.PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${serverConfig.PORT}`);
});
