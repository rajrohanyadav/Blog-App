var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    app = express();

// making connection to mongodb using mongoose
mongoose.connect("mongodb://localhost/blog_app");

// App Config
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// Declaring mongoose schema and model
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  date: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Restful ROUTES
// Root route
app.get("/", function(req, res){
  res.redirect("/blogs");
});

// INDEX
app.get("/blogs", function(req, res){
  Blog.find({}, function(err, blogs){
    if(err){
      res.redirect("/");
    } else {
      res.render("index", {blogs:blogs});
    }
  });
});

// NEW
app.get("/blogs/new", function(req, res){
  res.render("new");
});

// CREATE
app.post("/blogs", function(req, res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function(err){
    if(err){
      res.redirect("/");
    } else {
      res.redirect("/blogs");
    }
  });
});

// SHOW
app.get("/blogs/:id", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect("/");
    } else {
      res.render("show", {blog:foundBlog});
    }
  });
});

// EDIT
app.get("/blogs/:id/edit", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect("/");
    } else {
      res.render("edit", {blog:foundBlog});
    }
  });
});

// UPDATE
app.put("/blogs/:id", function(req, res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
    if(err){
      res.redirect("/");
    } else {
      res.redirect("/blogs/" + updatedBlog.id);
    }
  });
});

// DESTROY
app.delete("/blogs/:id", function(req, res){
  Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/");
    } else {
      res.redirect("/blogs");
    }
  });
});

// listening for connections
app.listen(process.env.PORT || 3000, function(){
  console.log("blog app server started");
});
