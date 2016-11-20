angular.module('starter')
  .controller('LoginController', function($scope, LoginService, $ionicPopup, $state, $sanitize, $ionicModal, $timeout, ngFB) {
    console.log('is this running');

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for login Modal
    $scope.data = {};

    // Create the login modal that we will use later
    // $ionicModal.fromTemplateUrl('templates/login.html', {
    //   scope: $scope
    // }).then(function(modal){
    //   $scope.modal = modal;
    // });


    // Triggered in the login modal to close it
    $scope.closeLogin = function(){
    //
    //   // greyed out bellow code because cosole eror stating could not find "hide".
    //
    //   // $scope.modal.hide();
    };
    // Open the login modal
    // $scope.login = function() {
    //   $scope.modal.show()
    //     // console.log("LOGIN user: " + $scope.data.username + " - PW: " + $scope.data.password);
    // };

    // perform the  login action when the user submits the login form
    $scope.login = function() {
      LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data){
        $state.go('map');
      }).error(function(data){
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
      });
      console.log('Log in time', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login// code if using a login system
      // $timeout(function(){
      //   $scope.closeLogin();
      // }, 1000);
    };

    $scope.fbLogin = function () {
      ngFB.login({scope: 'email,read_stream,publish_actions'}).then(function(response){
        if (response.status === 'connected'){

          console.log('Facebook login succeeded')
          .then(function(response){
            $state.go('map')
          })
          $scope.closeLogin();
        } else {
          alert('Facebook login failed');
        }
      });
    }

  })


  .controller('signUpCtrl', function($scope,$http,$state,$stateParams,){
    $scope.userForm = {};

    $scope.addUser = function() {
      event.preventDefault();
      if($scope.userForm.driver){
        // ApiPostDrivers.postApiDataDrivers($scope.userForm)
        $http.post('http://localhost:3000/drivers', $scope.userForm)

      // if($scope.userForm.driver) {
      //   $http.post('https://mysterious-coast-25984.herokuapp.com/drivers', $scope.userForm)

        .then(function(response){
          $state.go('map')
        })
        alert('Driver added to Drivers list:' + $scope.userForm.item)
        $scope.userForm.item = ""

      } else {

        // ApiPost.postApiData($scope.userForm)

        $http.post('http://localhost:3000/users', $scope.userForm)

        // $http.post('https://mysterious-coast-25984.herokuapp.com/users', $scope.userForm)

        .then(function(response){
          $state.go('map')
        })
        alert('User added to Users list:' + $scope.userForm.username)
        $scope.userForm = {}
      }
    };
  })
}
.controller('UserCtrl',      function($scope,$http,$state,$stateParams){
  $scope.userForm = [];
  // ApiGet.getApiData($scope.userForm)

// hiiii
// .controller('UserCtrl', function($scope,$http,$state,$stateParams){
//
//   $scope.user = [];
  $http.get('https://localhost:3000/users', {cache: true})

  .then(function(response){
    return $scope.user = response.data
  })
})

.controller('DriverCtrl',
function($scope,$http,$state,$stateParams){
  $scope.driverForm = [];

  // ApiGetDrivers.getApiDataDrivers($scope.userForm)

  $http.get('https://localhost:3000/drivers', {cache: true})

  .then(function(response){
    return $scope.driver = response.data
  })
})

.controller('TripCtrl', function($scope, $http,$state){
  $scope.tripForm = [];
  $scope.addTrip = fucntion(){
    event.preventDefault()
    $http.post('http://localhost:3000/trips', $scope.tripForm {cache:true})
    .then(function(response){
      $state.go('map')

  })
  alert('Trip added to Trips list:' + $scope.tripForm.item)
  $scope.tripForm.item = ""
  })
}

.controller('ChatController', function($stateParams,socket, $sanatize, $ionicScrollDelegate, $timeout){

  var self=this;
  var typing = false;
  var lastTypingTime;
  var TYPING_TIMER_LENGTH = 400;

  // Add colors
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
     '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
     '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  //initializing messages array
  self.messages=[]


  socket.on('connect',function(){
    connected = true
    // Add user called nickname
    socket.emit('add user', 'username');
    })
  socket.on('new message', function (data){
    addMessaageToList(data.username,true,data.messaage)
  });

  //function called when user hits the send buttton
  self.sendMessage=function(){
    socket.emit('new message', self.message)
    addMessageToList($stateParams.username,true,self.message)
    socket.emit('stop typing');
    self.message = ""
  }

  function addMessageToList(username,style_type,message){
    username = $sanitize(username) //The input is sanitizedFor more info reach this link
    var color = style_type ? getUsernameColor(username) : null //Get color for user
    self.messages.push({content:$sanitize(message),style:style_type,username:username,color:color}) // Push the messages to the messages list.
      $ionicScrollDelegate.scrollBottom();// Scroll to the bottom to read the latest.
    }

    // Whenever the server emits 'user joined', log it in the chat body
    socket.on('user joined', function (data) {
      addMessageToList("",false,data.username + " joined")
      addMessageToList("",false,message_string(data.numUsers))
    });

    // Whenever the server emits 'user left', log it in the chat body
    socket.on('user left', function (data) {
      addMessageToList("",false,data.username+" left")
      addMessageToList("",false,message_string(data.numUsers))
    });

  // Return message string depending on the number of users
    function message_string(number_of_users)
    {
      return number_of_users === 1 ? "there's 1 participant":"there are " + number_of_users + " participants"
    }

    //Whenever the server emits 'typing', show the typing message
    socket.on('typing', function (data) {
      addChatTyping(data);
    });

    // Whenever the server emits 'stop typing', kill the typing message
    socket.on('stop typing', function (data) {
      removeChatTyping(data.username);
    });

  // Adds the visual chat typing message
  function addChatTyping (data) {
      addMessageToList(data.username,true," is typing");
  }

  // Removes the visual chat typing message
  function removeChatTyping (username) {
      self.messages = self.messages.filter(function(element){return element.username != username || element.content != " is typing"})
  }

  // Updates the typing event
      function sendUpdateTyping(){
        if(connected){
            if (!typing) {
                typing = true;
                socket.emit('typing');
            }
        }
        lastTypingTime = (new Date()).getTime();
        $timeout(function () {
            var typingTimer = (new Date()).getTime();
            var timeDiff = typingTimer - lastTypingTime;
            if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
              socket.emit('stop typing');
              typing = false;
            }
            }, TYPING_TIMER_LENGTH)
      }





  })

  .controller('ToggleCtrl', function($scope,$ionicSideMenuDelegate) {
    $scope.toggleLeftSideMenu = function() {
      $ionicSideMenuDelegate.toggleLeft();
    };
  })

  .controller('TabsCtrl', function($scope, $ionicSideMenuDelegate){
    $scope.openMenu = function() {
      $ionicSideMenuDelegate.toggleLeft();
    };
  })

  .controller('MapCtrl', function($scope, socket, $state, $cordovaGeolocation) {
  var options = {timeout: 10000, enableHighAccuracy: true};

  var webSocket, myMap;
  var markers =  {};

  function initialize(mapContainer) {
    // Here we create a new connection, but you can reuse a existing one
    socket = io.connect("http://localhost:3000");

    // Creating google map
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    webSocket.on('location update', updateMarker);
    webSocket.on('user disconnected', removeMarker);
    websocket.emit('request locations', loadMarkers);
  }

  function updateMarker(data) {
    var marker = markers[data.key];
    if(marker) {
      marker.setPosition(new google.maps.LatLng(data.lat,data.lng));
    } else {
      markers[data.key] = getMarker(data.lat, data.lng, data.name);
    }
  }

  function removeMarker(key){
    var marker = markers[key];
    if(marker){
      marker.setMap(null);
      delete markers[key];
    }
  }

  function loadMarkers(data) {
    for(key in data) {
      var user = data[key];
      markers[key] = getMarker(user.lat, user.lng, user.name);
    }
  }

  function getMarker(lat, lng, label) {
    return new google.maps.Marker({
      title: label,
      map: $scope.map,
      position: new google.maps.LatLng(lat,lng)
    });
  }

  function tryGeolocation(){
    if(navigator.geolocation) {
      navigation.geolocation.getCurrentPosition(sendLocation, errorHandler);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  function sendLocation(position) {
  var data = {
    lat : position.coords.latitude,
    lng : position.coords.longitude,
  }
  webSocket.emit("send location", data);

}

  function errorHandler(error) {
    alert('Eror detecting your location');
  }
})
