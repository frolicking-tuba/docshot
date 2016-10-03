const redis = require('redis');

module.exports = (listName) => {
  const connection = redis.createClient();
  let popCallback = null;

  const popped = function popped(err, value) {
    if (err) {
      console.log(err);
    } else {
      popCallback(value[1]);
    }

    startPopping();
  };

  const startPopping = function startPopping() {
    connection.blpop(listName, 0, popped);
  };

  return {
    push(value) {
      connection.lpush(listName, value);
    },
    onPop(callback) {
      popCallback = callback;
      startPopping();
    }
  };
};
