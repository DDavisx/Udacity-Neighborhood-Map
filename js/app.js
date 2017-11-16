function AppViewModel(locationData) {
  var self = this;
  var infowindow = new google.maps.InfoWindow();
  self.locations = ko.observableArray(locationData);
  self.appFilter = ko.observable('');
  self.filterMessage = ko.observable();
  self.Markers = [];

  // https://groups.google.com/forum/#!topic/brewerydb-api/xMRMXNwK5P8
  // Brewerydb does not support Cors and for this application I used a Cors proxy to serve data
  // also note that Developer API for Brewerydb is limited to 400 requests per day.

  // Request Brewery Data from 3rd party Api.
  self.getBreweryInfo = function(marker, brewId) {
    var BreweryUrl = 'https://api.brewerydb.com/v2/brewery/' + brewId +
      '?key=daeec71cc26d468d4934a3b36c4cdbd0';
    var corsProxy = 'https://cors-anywhere.herokuapp.com:443/';
    var Url = corsProxy + BreweryUrl;
    var result = 'null';
    $.getJSON(Url, function(dataObj) {
      self.createInfoWindow(marker, dataObj.data);
    }).fail(function(jqXHR, textStatus, errorThrown) {
      self.createInfoWindow(marker, {
        'error': 'Sorry! An error has occured. Please try again later.'
      });
    });
  };

  // remove the marker Bounce animation
  self.removeMarkerBounce = function(marker) {
    setTimeout(function() {
      marker.setAnimation(null);
    }, 1400);
  };

  // Begin the marker Bounce animation
  self.animateMarkerBounce = function(id) {
    for (var i = 0; i < self.Markers.length; i++) {
      var marker = self.Markers[i];
      if (marker.id == id) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        self.removeMarkerBounce(marker);
      } else {
        marker.setAnimation(null);
      }
    }
  };

  //Build Google info WIndow using data from the 3rd party Api
  self.createInfoWindow = function(marker, data) {
    var source = $("#info-template").html();
    var template = Handlebars.compile(source);
    infowindow.setContent(template(data));
    infowindow.open(map, marker);
  };

  //Remove the Google Markers
  self.ClearMarkers = function() {
    for (var i = 0; i < self.Markers.length; i++) {
      self.Markers[i].setMap(null);
    }
  };

  //Capture click of Menu item and center map on corresponding Marker
  //and display an InfoWindow
  self.menuItemClick = function(e) {
    infowindow.close();
    self.animateMarkerBounce(e.id);
    var marker = self.Markers.find(function(item) {
      return item.id == e.id;
    });
    map.setCenter(marker.getPosition());
    self.getBreweryInfo(marker, e.brewid);
  };

  //Build markers to display on the Map.
  self.renderMarkers = function(locations, animationType) {
    self.ClearMarkers();
    var bounds = new google.maps.LatLngBounds();

    for (var i = 0; i < locations.length; i++) {
      var locationItem = locations[i];
      var marker = new google.maps.Marker({
        animation: animationType,
        id: locationItem.id,
        map: map,
        position: locationItem.location,
        title: locationItem.title,
        brewid: locationItem.brewid
      });

      //Clicking a marker will center and display info window
      marker.addListener('click', function() {
        self.animateMarkerBounce(this.id);
        map.setCenter(this.getPosition());
        self.getBreweryInfo(this, this.brewid);
      });

      self.Markers.push(marker);
      bounds.extend(marker.position);
    }
  };

  //Initialize the google map
  self.renderMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 42.7341925,
        lng: -84.5455013
      },
      disableDefaultUI: true,
      zoom: 13
    });
  };
  self.renderMap();

  //Filter the Locations baseed on the search field and return to array
  this.filteredLocations = ko.computed(function() {
    var filterResult = [];
    self.filterMessage('no');
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < self.locations().length; i++) {
      var location = self.locations()[i];
      if (location.title.toLowerCase().includes(self.appFilter().toLowerCase())) {
        filterResult.push(location);
        bounds.extend(new google.maps.LatLng(location.location.lat,
          location.location.lng));
      }
    }
    self.renderMarkers(filterResult, google.maps.Animation.Fade);
    map.fitBounds(bounds);
    map.setCenter(bounds.getCenter());
    self.filterMessage(filterResult.length <= 0 ? 'Sorry! no results found' :
      '');
    return filterResult;
  }, this);

  // On resize of the web page fit all markers on the screen
  google.maps.event.addDomListener(window, "resize", function() {
    infowindow.close();
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < self.Markers.length; i++) {
      self.Markers[i].getPosition();
      bounds.extend(self.Markers[i].getPosition());
    }
    map.fitBounds(bounds);
  });

  self.hideMenu = function() {
    $('.menu').hide();
    $('.open').show();
  };

  self.showMenu = function() {
    $('.open').hide();
    $('.menu').show();
  };
}

window.initApp = function() {
  ko.applyBindings(new AppViewModel(locationData));
};

window.appError = function() {
  $('.menu').hide();
  $('#map').append(
    '<div class="map-error"> Sorry! An error has occured. Please try again later.</div>'
  );
};
