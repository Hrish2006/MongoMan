Mongoman.DatabasesController = Ember.ArrayController.extend({
  content: null,
  selectedItem: null,
  copieddbName: null,
  newName: null,
  itemController: 'database',
  isLoaded: Em.computed.alias('content'),
  statusText: "Hang on...",

  actions: {

    addDatabase: function() {
      var self = this;
      $("#newdb-create" ).dialog({
        resizable: false,
        height:250,
        width: 450,
        modal: true,
        buttons: {
          Create: function() {
            var newDbName = self.get('content.newDbName');
            var url = '/databases?';
            self.set('statusText', 'Creating database... just for you');
            self.set('isLoaded',false);
            Mongoman.PostRequest.post(url, {database_name: newDbName}, 'POST').then(
              function success() {
                window.location.href= '/';
              },
              function failure() {
                //boo!
              });

            $(this).dialog("close");
          },
          Cancel: function() {
            $(this).dialog("close");
          }
        }
      });
    },

    /**
    * Let only one db to be in selected state
    * at any given time.
    */
    selected: function(item) {
      if (!this.get('selectedItem')) {
        this.set('selectedItem', item);
      }
      else {
        this.get('selectedItem').send('toggleSelection');
        this.set('selectedItem', item);
      }

    },

    /**
    * When the checkbox is unchecked
    *
    */
    deselect: function(item) {
      if (this.get('selectedItem') === item) {
        this.set('selectedItem', null);
      }
    },

    /**
      These four methods are invoked via the 'action' present on the widgets.
      They all work on the 'selectedItem' which is the database that currently holds user's interest.
      @todo figure out how to do this better because the controller seems to be getting a little fat.
    */
    copy: function() {
      var self = this;
      $("#db-copy-dialog" ).dialog({
        resizable: false,
        height:250,
        width: 450,
        modal: true,
        buttons: {
          Create: function() {
            var db = self.get('selectedItem').get('name');
            var url = '/databases/copy/' + self.get('copieddbName') + '?';
            self.set('statusText', 'Copying database... just hang on...');
            self.set('isLoaded',false);
            Mongoman.PostRequest.post(url, {database_name: db}, 'PUT').then(
              function success() {
                window.location.href= '/';
              },
              function failure() {
                //boo!
              });

            $(this).dialog("close");
          },
          Cancel: function() {
            $(this).dialog("close");
          }
        }
      });

    },

    Rename: function() {
      var self = this;
      $("#db-rename-dialog" ).dialog({
        resizable: false,
        height:250,
        width: 450,
        modal: true,
        buttons: {
          Rename: function() {
            var db = self.get('selectedItem').get('name');
            var url = '/databases/rename/' + db + '?';
            self.set('statusText', 'Renaming database...');
            self.set('isLoaded',false);
            Mongoman.PostRequest.post(url, {new_name: self.get('newName')}, 'PUT').then(
              function success() {
                window.location.href= '/';
              },
              function failure() {
                //boo!
              });

            $(this).dialog("close");
          },
          Cancel: function() {
            $(this).dialog("close");
          }
        }
      });

    },

    showStats: function() {

    },

    drop : function() {
      var self = this;
      $("#placeholder-confirm-drop-db" ).dialog({
        resizable: false,
        height:250,
        width: 450,
        modal: true,
        buttons: {
          "Drop Database": function() {
            var url = '/databases/' + self.get('selectedItem').get('name');
            self.set('isLoaded',false);
            Mongoman.PostRequest.post(url , {} , 'DELETE').then(
              function success() {
                window.location.href= '/';
              },
              function failure() {
                //boo!
              });
            $(this).dialog("close");
          },
          Cancel: function() {
            $(this).dialog("close");
          }
        }
      });
    }





  }

});
