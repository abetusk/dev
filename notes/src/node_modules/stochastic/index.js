'use strict';

var poissP = module.exports.poissP = function (lambda, T, path) {
  var U, exp, N_t, t, n;
  N_t = [0];
  t = 0;
  n = 0;

  if (T <= 0 || lambda <= 0) {
    return N_t;
  };

  while (t < T) {
    U = Math.random();
    exp = -Math.log(U)/lambda;
    t += exp;
    if (t < T) {
      n += 1;
      N_t.push(t);
    };
  };

  if (path == false) {
    return n;
  }
  else {
    return N_t;
  };
};
// Generates normal sample following Box Muller Algorithm
var norm = module.exports.norm = function(mu, sigma, num) {
  var U1, U2, x, y, z1, z2;
  var sample = [];

  if (num <=0 || sigma <=0) {
    return sample;
  };

  function boxMuller(mu,sigma) {
    U1 = Math.random();
    U2 = Math.random();
    z1 = Math.sqrt(-2 * Math.log(U1)) * Math.cos(2 * U2 * Math.PI);
    z2 = Math.sqrt(-2 * Math.log(U1)) * Math.sin(2 * U2 * Math.PI);
    x = mu + (sigma * z1);
    y = mu + (sigma * z2);
    return [x, y];
  }

  if (typeof num === 'undefined' || num == 1 ||(num % 1) != 0){
    return boxMuller(mu, sigma)[0];
  };

  if (num / 2 % 2 != 0) sample.push(boxMuller(mu, sigma)[0]);
  for (var i = 0; i < Math.floor(num / 2); i++){
    sample = sample.concat(boxMuller(mu, sigma));
  };
  return sample;
};

// B(t) = mu*t + sigma*W(t), W(t) ~ norm(0,sqrt(t))
var brown = module.exports.brown = function (mu, sigma, T, steps, path){
  var B_t = [0];
  var B = 0;
  var dt = T / steps;
  var dB;

  if (!(T > 0) || !(steps > 0)){
    return B_t;
  };

  if (path == false){
    return ((mu * T) + (sigma * norm(0, Math.sqrt(T))));
  }
  else{
    for (var i = 0; i < steps; i++){
      dB = (mu * dt) + (sigma * norm(0,Math.sqrt(dt)));
      B += dB;
      B_t.push(B);
    };
    return B_t;
  };
};

// (dS/S) = mu*dt + sigma*dW, W(t) ~ norm(0,sqrt(t))
var GBM = module.exports.GBM = function(S0, mu, sigma, T, steps, path) {
  var S_t = [];

  if (!(T > 0) || !(steps > 0)) {
    return B_t;
  };

  if (path == false) {
    return S0 * Math.exp((mu - (sigma * sigma / 2)) * T + (sigma * norm(0, Math.sqrt(T))))
  }
  else {
    var B_t = brown((mu - (sigma * sigma / 2)), sigma, T, steps);
    B_t.forEach(function(B) {
      S_t.push(S0 * Math.exp(B));
    })
    return S_t;
  };
};

var DTMC = module.exports.DTMC = function(transMatrix, steps, start, path) {
  //function to check if input is a valid transition matrix
  var isValid = function(matrix) {
    var n = matrix.length;
    for (var i = 0; i < n; i++) {
      var sum = 0;
      if (matrix[i].length != n) {
        return false;
      };
      for (var j = 0; j < n; j++) {
        if (matrix[i][j] > 1 || matrix[i][j] < 0) {
          return false;
        };
        sum += matrix[i][j];
      };
      var eps = (4 * Math.pow(10, -16));
      if (sum < 1 - eps || sum > 1 + eps) {
        return false;
      };
    };
    return true;
  };

  //return null if the transition matrix is not valid
  if (!isValid(transMatrix)) {
    return null;
  };

  //initialize the Markov Chain
  var fullPath = [start];
  var stateRow = transMatrix[start];
  var U;

  for (var i = 0; i < steps; i++) {
    U = Math.random();
    var sum = 0;
    for(var j = 0; j < stateRow.length; j++) {
      sum += stateRow[j];
      if (sum > U) {
        fullPath.push(j);
        stateRow = transMatrix[j];
        j = stateRow.length;
      };
    };
  };
  if (path == false) {
    return fullPath[fullPath.length - 1];
  }
  else {
    return fullPath;
  };
};


var CTMC = module.exports.CTMC = function(transMatrix, T, start, path) {
  // function to determine if input is a valid CTMC transition matrix
  var isValid = function(matrix) {
    var n = matrix.length;
    for (var i = 0; i < n; i++) {
      if (matrix[i].length != n) {
        return false;
      };
      for (var j = 0; j < n; j++) {
        if (matrix[i][j] < 0) {
          return false;
        };
      };
    };
    return true;
  };

  //return null if the transition matrix is not valid
  if (!isValid(transMatrix)) {
    return null;
  };

  // initialize simulation of the CTMC
  var fullPath = { 0: start };
  var lastState = start;
  var stateRow = transMatrix[start];
  var t = 0;
  var U, exp, sum;

  // begin simulation
  while (t < T) {
    var lambda = 0;
    for (var i = 0; i < stateRow.length; i++) {
      lambda += stateRow[i];
    };
    U = Math.random();
    exp = -Math.log(U) / lambda; //exp is the time to make the transition
    t += exp;

    if (t > T) {
      if (path == false) {
        return lastState;
      }
      else {
        return fullPath;
      };
    };

    sum = 0;
    U = Math.random();
    for (var i = 0; i < stateRow.length; i++) {
      sum += stateRow[i] / lambda;
      if (sum > U) {
        stateRow = transMatrix[i];
        fullPath[t] = i;
        lastState = i;
        i = stateRow.length;
      };
    };
  };
};

var sample = module.exports.sample = function(arr, n) {
  var samp = [];
  for (var i = 0; i < n; i++) {
    var index = Math.floor(Math.random() * arr.length);
    var value = arr[index];
    samp.push(value);
  };
  return samp;
};

var exp = module.exports.exp = function(lambda) {
  return (-Math.log(Math.random()) / lambda);
};

var pareto = module.exports.pareto = function(x_m, alpha) {
  return (x_m / Math.pow(Math.random(), 1 / alpha));
};

var hist = module.exports.hist = function(arr) {
  var newArr = arr.slice().sort(function(a, b) {
    return a - b;
  });

  var max = newArr[arr.length - 1];
  var min = newArr[0];
  var bins = Math.round(Math.sqrt(arr.length));
  var binSize = (max - min) / bins;

  var obj= {};
  var keys = [];
  for (var i = 0; i < bins; i++){
    var key = min + (i * binSize);
    keys.push(key);
    obj[key] = 0;
  };

  for (var j = 0; j < arr.length; j++){
    var val = min;
    var temp_key = 0;
    while(true) {
      if (newArr[j] == newArr[newArr.length-1]) {
        obj[keys[keys.length - 1]] += 1;
        break;
      }
      else if (newArr[j] < val + binSize) {
        obj[keys[temp_key]] += 1;
        break;
      }
      else{
        temp_key += 1;
        val += binSize;
      };
    };
  };

  return obj;
};
