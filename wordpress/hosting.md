### Introduction: Hosting

![](/ru/wordpress/images/hosting-0.png)

Before we begin developing the website, we need to prepare hosting for it.

> **Reference**
>
> **Hosting** is a service for placing a website on a server that is permanently connected to the internet.
>
>When you create a website, its files (texts, images, code, and database) need to be stored somewhere. Hosting is the rental of space on a server so that the website is available to users 24/7 through a domain name.
>
>The main types of hosting are:
>
>- **Local hosting** — hosting a website on your own computer.
>- **Shared hosting** — several websites on one server.
>- **VPS/VDS** — a dedicated part of a server with separate resources.
>- **Dedicated server** — a separate physical server.
>- **Cloud hosting** — resources are distributed across several servers.
>
>Without hosting, the website will not be available on the internet.

For the development stage, I chose free hosting. The easiest option was to register it with [SpaceWeb](https://sweb.ru/hosting/free/):

![](/ru/wordpress/images/hosting-1.png)
Although the hosting is free, it has everything needed to launch a full-fledged website:

![](/ru/wordpress/images/hosting-2.png)

It meets all the requirements for WordPress: we need recent versions of PHP and MySQL.

The ability to connect our own domain to the website will also be useful later, after development is complete, while the website is still not under heavy load.

Here, we can create a completely functional website.

**Note**
SpaceWeb states that this hosting has no time limit, but in reality your website may be deleted if it exceeds the load limit for several months and you do not switch to a paid plan.

I clicked the "Get" button:

![](/ru/wordpress/images/hosting-3.png)
I entered my phone number:

![](/ru/wordpress/images/hosting-4.png)

After confirming with an SMS code, I entered my email address, where I received all the hosting details:

**Credentials for the control panel, FTP, and SSH access**

Panel address: [cp.sweb.ru](http://cp.sweb.ru/)
Login: `login`
Server IP address: `77.222.40.198`
Password: `password`

Using the details I received, I opened the administration panel, signed in to the account, and started the automatic WordPress installation:

![](/ru/wordpress/images/hosting-5.png)

After that, our website under development appeared in Hosting -> Websites:

![](/ru/wordpress/images/hosting-6.png)

The Domains section shows two domains, but the `струныма.рф` domain is not actually connected to the website yet. I entered it because it will be used for this website after development is complete. To do this, we will need to make some additional settings, which I will describe in the relevant chapter.

![](/ru/wordpress/images/hosting-7.png)

We also received the technical domain `струныма.рф.swtest.ru`, where the website is already available.

Opening it displayed the WordPress setup window:

![](/ru/wordpress/images/hosting-8.png)

Here, we need to enter the hosting details:

![](/ru/wordpress/images/hosting-9.png)

These details are located in the hosting control panel under the Databases tab:

![](/ru/wordpress/images/hosting-10.png)

Here we can see the database name and login, which correspond to the fields in the form that WordPress asks us to complete:

- Database name = Database name
- Username = Login

The password can be found in the email containing all the details. If it was not included, it can be changed here:

![](/ru/wordpress/images/hosting-11.png)

We do not need to change the table prefix; that field is already correct.

This means that all fields are now filled in except for:

**Database host**

This field took some effort to resolve.

It is usually set to `localhost` by default, meaning the server's local address. However, this address did not work on this hosting service. WordPress displayed a connection error.

I returned to the administration panel and opened the access settings:

![](/ru/wordpress/images/hosting-12.png)

There I saw that `localhost` was included in the allowed access list:

![](/ru/wordpress/images/hosting-13.png)

Strangely, WordPress still could not connect to the database at this address.

I tried `127.0.0.1`, which is actually the same as `localhost`, only in standard IP format, but that did not help either.

Usually, when users encounter problems, they contact support, but support is not provided on free plans:

![](/ru/wordpress/images/hosting-14.png)
I continued looking for a solution and noticed the text "Connection host" in the same Databases section:

![](/ru/wordpress/images/hosting-15.png)

There was the address we needed:

![](/ru/wordpress/images/hosting-16.png)

It turned out that the port also had to be specified for the connection.

The value for the "Database host" field was:

`127.0.0.1:3308`

After I entered the required numbers, WordPress accepted them and let us continue:

![](/ru/wordpress/images/hosting-17.png)

The standard installation process then started. I entered the login and password for the future administrator account, along with the other information normally required when registering an account.

After that, I was greeted by the home page of the default Twenty Twenty-Five theme:

![](/ru/wordpress/images/hosting-18.png)

This is how the development of a new website for the glorious musical group began.

### Technical Specification

**Chapter 1: Divi**
