For 3 years I've been trying to learn programming. And every year, I've deepened my understanding of how the web works.

Learning the basics of software development and how the web works at a high level hasn't been easy. The best learning experience has been to dive in. I've learned so much in the past year working for [Airbrake](http://airbrake.io) (a developer tools company now a part of Rackspace), talking to customers, and becoming a part of the developer tools space.

Throughout my research, I never came across a single post that'd give a non-technical person a broad base of knowledge they could then use to specialize. I'm hoping for many other non-technical people, this is that post.

 
## How the Web Works
At a high level, the components of the web look like this:

[](http://justinmares.com/wp-content/uploads/2013/08/webstack1.png)
Ok. If I had seen this 2 years ago, I wouldn't know where to start. Let's roll through some definitions here.
## **The App Layer**
For complex websites the app layer encompasses your actual application: a web app, mobile app or basic Wordpress blog. A website's application is what you think probably of as the actual site. It is everything you click, see and interact with.

Let's take Facebook. Their application includes the interface where you can see friend's photos, upload pictures, post stuff, like other things, comment, add friends... you get the picture. The application is everything you interact with.

A website is like an iceberg. You know how 80% of an iceberg's mass is below the water? A website (or application) is similar - most of the action occurs under the surface. How you interact with an application is determined by...
## The Stack
As a tech company, your stack refers to the list of tools, languages, frameworks and databases you use to build your application. These languages can generally be separated into two buckets: *front-end* and* back-end* languages. These buckets interact to provide the overall experience of using an application.

The front-end  determines how your application looks when pulling it up via a web browser like Chrome or Firefox. A web browser does one thing: it reads and displays the front-end languages that a page is made of.

Front-end languages include **[HTML](http://www.skillcrush.com/terms/html.html)**, which makes up the text on a page, **[CSS](http://www.skillcrush.com/terms/css.html) **to style that text and other page elements, and **[JavaScript](http://www.skillcrush.com/terms/javascript.html) **to make things on a page interactive. For example, if you hit the "Follow [@jwmares](http://twitter.com/jwmares)" link on the upper right of this page - which you  should - clicking that link runs a JavaScript command that fetches your Twitter information from [cookies](http://en.wikipedia.org/wiki/HTTP_cookie) in your browser and sends a command to Twitter that says "add @jwmares to the list of people I follow."

Cool, huh?

If this still isn't making sense it might help to get an idea of what a web browser actually does. If you're curious what a website looks like to your browser, right-click and hit "view page source" on this (or any) webpage. You'll see what your web browser sees - HTML tags with their layout defined by CSS stylesheets and their interactions defined by JavaScript scripts.

**The back-end** includes everything that happens before stuff hits your browser. It might be simple (like a program that displays the date and time) or something more complex (like Facebook, Twitter, eBay or hundreds of other applications).

Let's take eBay for example. Everything you do (product searches, rankings, price checks and payment) all happens on the back-end.  Typical back-end components include a program (written in a back-end programming language like Python, Java, Ruby or PHP) that determines what an application can do, and a database that stores any relevant data.

In the case of eBay, you have specific *programs* that determine how to display products - how to rank them for specific searches, how to display the prices, how to update given people bidding on different products, and thousands of other use cases. These programs fetch necessary information from a *database* that stores everything a website needs to hold.

In a lot of ways, this is analogous to Excel. Think of Excel as a massive database, holding every bit of information you need regarding your product. Actually, when you're writing functions in Excel (things like "add this column, subtract this value from this value), you're writing programs! Web programs do the same thing - return and manipulate information that's stored in a database - just on a much larger, more complex level.

Some common languages often used for the back-end include:

- Ruby
- Python
- PHP
- Java (which, confusingly, is totally different than JavaScript)
- Perl
- ASP.NET
- C
- C++
- Go
- Erlang
- Javascript (Node.js)

Each of these languages can accomplish roughly the same thing, though there are tradeoffs in terms of hiring, speed, performance, etc. that I won't get into.

Common types of databases (also called data stores) are:

- PostgreSQL
- MySQL
- MongoDB
- CouchDB
- Redis
- Riak
- NoSQL
- Oracle
- Microsoft Access

Phew. That's a big (and confusing) list. As someone trying to familiarize yourself with tech, you don't need to understand exactly what each of these programming languages or databases do. Instead, you should be able to understand the context in which someone has expertise. For example, if Redis or MongoDB comes up, you should understand that each is a tool used to store data.

**Programming frameworks** are the last thing I  want to touch on. Programming frameworks are tools that make it easier to build something quickly. Think of your typical web application. Most contain common elements: an account creation process, shopping cart, etc. Frameworks help abstract away many of the more repetitive components that need to be built for a website by giving developers pre-built "gems" (or libraries) with functionality already included. For example, if you want to build a shopping cart, Spree provides a framework that makes it easy to build one.

As an analogy, think of building a house. The frame of every house is similar - wooden boards nailed together to form a basic structure. All the customization that makes a house unique goes on top of this frame - the finish in the kitchen, the layout, paint on the walls, etc. What's remarkably consistent across houses is the frame. If you wanted to build a stable house *fast,* it'd save you time to use a prebuilt framework.

That's exactly what using a web framework does. It allows you to build faster by taking advantage of prebuilt units of code. Rather than rewriting a shopping cart, you can use code from other developers who've built shopping carts in the past.

A complete list of frameworks for each programming language can be found [here](http://en.wikipedia.org/wiki/Comparison_of_web_application_frameworks), but many of the popular ones you'll hear about are below:

- Python - Django, Pyramid
- Ruby - Ruby on Rails, Sinatra
- PHP - CakePHP, Zend, Laravel, CodeIgnighter
- Java - Grails, Play!
- Javascript - jQuery, Backbone.js, Ember.js,

Each of these frameworks come with different software packages, known as libraries, plugins or gems (in the Rails community), that help developers accomplish specific things. For example, here's a list of [Python libraries](http://doda.co/7-python-libraries-you-should-know-about) and the different reasons developers may want to use them.

Together, these languages, databases and frameworks make up a product's *tech stack*. Take a look at [Instagram's tech stack](http://instagram-engineering.tumblr.com/post/13649370142/what-powers-instagram-hundreds-of-instances-dozens-of) to get a general sense of how a tech stack looks to other engineers.

That was a lot to take in. The last two parts are somewhat simpler, and contain a LOT less jargon.
## Platform
The platform an application runs on refers to any software platform they may be using to build their app. As you'll see in the server section, buying or renting server hardware, managing those servers, provisioning them and scaling them can be a major time-suck. Many companies choose to instead focus on building their application, and build on top of a platform-as-a-service (also known as PaaS) like [Heroku](http://heroku.com) or OpenShift. Imagine if you were trying to work in Excel and had to download, install and set up a new version of Excel every time a worksheet filled up. That would take time and not help your efforts to build an amazing Excel model.

Basically, building on top of a platform like Heroku means you don't have to worry as much about buying servers and scaling them. Instead, you can just push code to Heroku and let them deal with the inevitable provisioning, setup and scaling issues.

Not much else to say here, just that going this route is a lot easier than managing this yourself. However, it is more expensive so it may not make sense at a certain scale.
## Server
Beneath the entire virtual world that is the internet lies something many don't like to talk about. That something is *actual hardware*.

That's right. Everything you see, do and interact with on the internet is a program running on top of a physical box. A server. That sits in a cooled room on a rack somewhere:



 

You don't need to know a ton about servers to be honest, only that they have their own operating systems (usually Linux), and make up what people refer to as "the cloud". If you're using a cloud hosting provider like [Rackspace](http://rackspace.com), you're paying them to manage your servers for you.

Cloud hosting is one of the major reasons it's easier to start a web company now than it was 10 years ago. Rather than buying and setting up dozens or hundreds of your own servers, you can pay Rackspace to manage hundreds, even thousands of them for you.

 
## How Software Actually Gets Built
First, there are different stages (known as environments) in which software gets built. There's the dev environment where software engineers work on building new features. These are things that are being worked on but aren't ready to go live just yet.

Developers will use tools like [GitHub](http://GitHub.com) to manage and share versions of their code (and push code live); an [IDE](http://en.wikipedia.org/wiki/Integrated_development_environment) or text editor to write code, and a staging server to host the code they write. For managing and spinning up servers, they'll use tools like Puppet or Chef to ensure servers are set up in a consistent way.

Once features are ready to go live, they get pushed (or deployed) to what's known as a production environment. At this point, the code has likely run through a series of automated tests to make sure it won't break anything once it's live. There's a whole subset of software development - DevOps - responsible for deploying code into a production environment, and making sure that the deploy process goes smoothly and is consistent. To get a better understanding of this process, check out an [interview I did with a lead engineer at Stripe](https://airbrake.io/blog/devops/how-stripe-builds-software-an-interview-with-cto-greg-brockman) and another with [Digg's former lead architect, Joe Stump](https://airbrake.io/blog/guest-post/how-digg-and-sprint-ly-build-software-an-interview-with-joe-stump).

 
## Why Is All This Important?
Understanding how the web works from a technical perspective - even at a high level - has been extremely valuable for me.

I've made bad hires because I didn't understand the skill-sets of people I was interviewing. I've lost $14k (as a college student no less) because I didn't grasp what I was hiring developers to build, or comprehend what goes into building an application. I was completely blind.

Especially if you want to start a company, learning how technology actually works is imperative. As [this article](http://quibb.com/links/four-traits-of-successful-non-technical-solo-founders) mentions, non-technical founders create successful startups by having these 4 traits:

- Technically literate
- Product oriented
- Have cash
- Are well-connected

As software seeps into every sector of the economy, it's even more important for employees of all kinds to understand tech at a basic level. Your sales, support, marketing and community hires will all be better off if they have a basic understanding of how the web works, and how their software product fits into that landscape.

Early on at [Airbrake](http://airbrake.io), I had to turn a non-technical account management team into one that could talk and sell to developers. This process made me realize how few people understand how software is actually built, and how hard it was to explain. Hopefully, this post provides a jumping-off point for the many of you that want to improve their technical literacy.

What parts of this do you still have questions about? What have you struggled with in the past? Leave a comment below, and I'll respond to every one.