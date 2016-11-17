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
