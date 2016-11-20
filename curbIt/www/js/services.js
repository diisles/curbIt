angular.module('services',[])

.factory('socket',function(socketFactory){
  //Create socket and connect to http://localhost:3000
  var myIoSocket = io.connect('http://localhost:3000');

  mySocket = socketFactory({
    ioSocket: myIosocket
  });

  return mySocket;
})
