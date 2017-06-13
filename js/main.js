//defining all the global variables
var global = {
    fs_url_start: "https:api.foursquare.com/v2/venues/",
    fs_url_end: "?client_id=4KJA1IBMXZKJF1SNSZGHVF3WVZOO5BC4BQOZ2GZD3CJMMBRQ&client_secret=XRJRIWXZDRVSV2MHVGLGBFWGJDMTKKQRGM00051EXN2DA5ER&v=20170514",
    fs_error: "Data Not Found"

};
var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 28.7295,
            lng: 77.0965
        },
        zoom: 13
    });
    markerdata = new google.maps.InfoWindow();
    ko.applyBindings(new model());
}

function mapError() {
    document.getElementById('map').innerHTML = "Map Error";
}
//ViewModel function defining view model
var model = function() {
    var self = this;
    self.rests = [];

    //adding markers to marker array
    self.request = function(marker) {
        $.ajax({
            type: "GET",
            url: global.fs_url_start + marker.resid + global.fs_url_end,
            dataTypes: "json",
            success: function(data) {
                var dat = data.response.venue;
                if (dat.hasOwnProperty('likes')) {
                    marker.likes = dat.likes.count;
                } else {
                    marker.likes = global.fs_error;
                }
            },
            error: function(e) {
                marker.likes = global.fs_error;
            }
        });
    };
    self.animateKar0 = function(marker) {

        self.request(marker);
        //can't be done by knockout because its not a DOM object
        marker.addListener('click', function() {
            self.minfo(marker);
        });
    };



    for (var i = 0; i < rest.length; i++) {
        var marker = new google.maps.Marker({
            //creating new marker objects
            position: {
                lat: rest[i].lat,
                lng: rest[i].lng
            },
            map: map,
            title: rest[i].name,
            resid: rest[i].id,
            show: ko.observable(rest[i].show),
            animation: google.maps.Animation.DROP
        });
        self.request(marker);
        self.rests.push(marker);
        self.rests[self.rests.length - 1].setVisible(self.rests[self.rests.length - 1].show());


    }

    //click binding for google marker object
    for (var mar = 0; mar < rest.length; mar++) {
        self.animateKar0(self.rests[mar]);
    }

    self.setVisibilty = function(show) {
        for (var i = 0; i < rest.length; i++) {
            self.rests[i].show(show);
            self.rests[i].setVisible(show);
        }
    };

    //search text 
    self.sText = ko.observable("");
    //checks how many places are available in the array corresponding to search text
    self.searchIt = function() {
        var sText = self.sText();
        if ((sText === "") || ((sText.length === 0))) {
            for (var mar = 0; mar < rest.length; mar++)
                self.setVisibilty(true);
        } else {
            for (var mar = 0; mar < rest.length; mar++) {
                if (self.rests[mar].title.toLowerCase().indexOf(sText.toLowerCase()) >= 0) {
                    self.rests[mar].show(true);
                    self.rests[mar].setVisible(true);
                } else {
                    self.rests[mar].show(false);
                    self.rests[mar].setVisible(false);
                }
            }
        }
    };

    //setting bouncing animation to the markers
    self.BounceMarker = function(marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 1000);
    };

    //opening marker info window
    self.minfo = function(marker) {
        self.dt = marker;
        formatData = function() {
            if (self.dt.likes === "" || self.dt.likes === undefined) {
                return global.fs_error;
            } else {
                return "likes: " + self.dt.likes;
            }
        };


        //to display the likes of the restaurants
        var resinfo = "Name: " + self.dt.title + "<br>" + formatData();
        markerdata.setContent(resinfo);
        markerdata.open(map, marker);
        self.BounceMarker(marker);

    };


};