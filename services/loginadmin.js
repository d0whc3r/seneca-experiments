module.exports = function(options) {
  var seneca = this;
  var name = 'math-service';

  seneca.add({ role: 'math', cmd: 'sum' }, function(_msg, respond) {
    var msg = _msg.args.query;
    console.log('math msg:', _msg.args);
    var sum = msg.left + msg.right;
    respond(null, { answer: sum });
  });

  return { name };
};