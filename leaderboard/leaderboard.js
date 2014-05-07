// http://stackoverflow.com/questions/10588038/how-to-use-the-existing-mongodb-in-a-meteor-project


Messages = new Meteor.Collection("messages");

if (Meteor.isClient) {
  Template.leaderboard.messages = function () {
    return Messages.find({}, {sort: {score: -1, text: 1}});
  };

  Template.leaderboard.selected_text = function () {
    var message = Messages.findOne(Session.get("selected_text"));
    return message && message.text;
  };

  Template.message.selected = function () {
    return Session.equals("selected_text", this._id) ? "selected" : '';
  };

  Template.leaderboard.events({
    'click input.inc': function () {
      Messages.update(Session.get("selected_text"), {$inc: {score: 1}});
    }
  });

  Template.message.events({
    'click': function () {
      Session.set("selected_text", this._id);
    }
  });
}

// On server startup, create some texts if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.methods({
      removeAllMessages: function() {
        return Messages.remove({});
      }
    });


// For now, auto-clean the DB on every entry during development
    Meteor.call('removeAllMessages');

    if (Messages.find().count() === 0) {
      var msgs = ["Question 1",
                   "Question 2",
                   "Question 3",
                   "Question 4"];
      for (var i = 0; i < msgs.length; i++)
        Messages.insert({text: msgs[i], score: Math.floor(Random.fraction()*10)*1});
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


