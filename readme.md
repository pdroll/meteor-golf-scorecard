#Meteor Golf Scorecard

Simple golf scorecard app, powered by [meteor.js](https://www.meteor.com/).

## Features
- Score updates in real time
- Add users and one-time players to games
- Save and view past games
- Save Courses, along with notes for each hole
- Geolocate holes and calculate current distance from the hole

## Tech Specs
- Uses [meteor user accounts](http://docs.meteor.com/#/basic/accounts).
- Routing via [iron router](https://github.com/iron-meteor/iron-router).
- Removed `autopublish` and `insecure` packages for tighter control over data and permissions.
- Sass compilation via the [fourseven:scss](https://github.com/fourseven/meteor-scss) package.
- SVG icon set courtesy of [Open Iconic](https://useiconic.com/open/).

## Example

[pdroll-golf-scorecard.meteor.com](http://pdroll-golf-scorecard.meteor.com/)

## Build

### Local development

```
$ meteor
```

Your app will now be running at [http://localhost:3000](http://localhost:3000).

### Deploy


```
$ meteor deploy YOURAPP.meteor.com
```

For more deployment options, see [http://docs.meteor.com/#/full/deploying](http://docs.meteor.com/#/full/deploying).
