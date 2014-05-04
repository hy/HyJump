// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

// http://stackoverflow.com/questions/10588038/how-to-use-the-existing-mongodb-in-a-meteor-project


Players = new Meteor.Collection("players");

if (Meteor.isClient) {
  Template.leaderboard.players = function () {
    return Players.find({}, {sort: {score: -1, name: 1}});
  };

  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.name;
  };

  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

  Template.leaderboard.events({
    'click input.inc': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 1}});
    }
  });

  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    }
  });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.methods({
      removeAllPlayers: function() {
        return Players.remove({});
      }
    });


// For now, auto-clean the DB on every entry during development
    Meteor.call('removeAllPlayers');

    if (Players.find().count() === 0) {
      var names = ["Question 1",
                   "Question 2",
                   "Question 3",
                   "Question 4"];
      for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], score: Math.floor(Random.fraction()*10)*1});
    }
  });

  // simple route with
  // name 'about' that
  // matches '/about' and automatically renders
  // template 'about'
  Router.map( function () {
    this.route('about');
  });

  // complex route with
  // name 'notFound' that for example
  // matches '/non-sense/route/that-matches/nothing' and automatically renders
  // template 'notFound'
  // HINT:
  //// Define a global not found route as the very last route in your router
  //// Also this is different from the notFoundTemplate in your Iron Router
  //// configuration!

  // this.route('notFound', {
  //   path: '*'
  // });

}



