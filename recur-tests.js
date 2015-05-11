_.each([
  // [schedule, expected dates]
  [
    "Every day at 10 am"
    , [{
          period: 'day'
          , interval: 1
          , on: {
            period: 'minutes'
            , at: 60 * 10
          }
        }
        , "2015-01-01T00:00:00"
        , "2015-01-02T00:00:00"]
    , [
      "2015-01-01T10:00:00"
    ]
  ]
  , [
    "Every other day at 10 am"
    , [{
          period: 'day'
          , interval: 2
          , offset: 1
          , on: {
            period: 'minutes'
            , at: 60 * 10
          }
        }
        , "2015-01-01T00:00:00"
        , "2015-01-03T00:00:00"]
    , [
      "2015-01-02T10:00:00"
    ]
  ]
  , [
    "Every other day at 10 am, 2 pm, and 2 am (next day)"
    , [{
          period: 'day'
          , interval: 2
          , offset: 1
          , on: [
            {
              period: 'minutes'
              , at: 60 * 10
            }
            , {
              period: 'minutes'
              , at: 60 * 14
            }
            , {
              period: 'minutes'
              , at: 60 * 26
            }
          ]
        }
        , "2015-01-01T03:00:00"
        , "2015-01-04T00:00:00"]
    , [
      "2015-01-02T10:00:00"
      , "2015-01-02T14:00:00"
      , "2015-01-03T02:00:00"
    ]
  ]
  , [
    "Every other week on mondays and fridays at 10 am"
    , [{
          period: 'week'
          , interval: 2
          , offset: 0
          , on: [
            {
              period: 'day'
              , at: 1
              , on: {
                period: 'minutes'
                , at: 60 * 10
              }
            }
            , {
              period: 'day'
              , at: 5
              , on: {
                period: 'hours'
                , at: 10
              }
            }
          ]
        }
        , "2014-12-28T00:00:00"
        , "2015-01-12T00:00:00"]
    , [
      "2014-12-29T10:00:00"
      , "2015-01-02T10:00:00"
    ]
  ]
  , [
    "When start is not zeroed out"
    , [{
          period: 'day'
          , interval: 1
          , on: {
            period: 'minutes'
            , at: 60 * 10
          }
        }
        , "2015-01-01T09:00:00"
        , "2015-01-02T00:00:00"]
    , [
      "2015-01-01T10:00:00"
    ]
  ]
  , [
    "Twice a week, sunday and saturday"
    , [{
          period: 'week'
          , interval: 1
          , on: [
            {
              period: 'day'
              , at: 0
              , on: {
                period: 'minutes'
                , at: 60 * 10
              }
            }
            , {
              period: 'day'
              , at: 6
              , on: {
                period: 'minutes'
                , at: 60 * 10
              }
            }
          ]
        }
        , "2015-01-01T00:00:00"
        , "2015-01-11T00:00:00"]
    , [
      "2015-01-03T10:00:00"
      , "2015-01-04T10:00:00"
      , "2015-01-10T10:00:00"
    ]
  ]
  , [
    "Can use dates for 'at' value"
    , [{
          period: 'week'
          , interval: 1
          , on: {
            period: 'day'
            , at: moment().weekday(1).toDate()
          }
        }
        , "2015-01-01T00:00:00"
        , "2015-01-06T00:00:00"]
    , [
      "2015-01-05T00:00:00"
    ]
  ]
  , [
    "Can use an alias dictionary for shortcuts"
    , [{
          period: 'day'
          , interval: 1
          , on: {
            period: 'minutes'
            , at: 'morning'
          }
        }
        , "2015-01-01T00:00:00"
        , "2015-01-02T00:00:00"
        , {
          morning: 60 * 10
        }
      ]
    , [
      "2015-01-01T10:00:00"
    ]
  ]
  , [
    "Restricts results to between period"
    , [
      {
        period: 'day'
        , interval: 1
        , between: [moment("2015-01-02T00:00:00").toDate(), moment("2015-01-03T00:00:00").toDate()]
      }
      , "2015-01-01T00:00:00"
      , "2015-01-04T00:00:00"
    ]
    , [
      "2015-01-02T00:00:00"
    ]
  ]
], function (args) {

  var testName = args.shift();
  var methodArgs = _.map(args.shift(), function (a) {
    if (_.isString(a)) {
      var date = moment(a, "YYYY-MM-DDThh:mm:ss", true);
      if (date.isValid())
        return date.toDate();
    }
    return a;
  });
  var expectedDates = _.map(args.shift(), function (a) {
    return moment(a).toDate();
  });

  Tinytest.add('Recur - getInstances - ' + testName, function (test) {
    test.equal(Recur.getInstances.apply(Recur, methodArgs), expectedDates);
  });
});

// Tinytest.add('Recur - parser - basic', function (test) {
//   var parsedSchedule = Recur.parser().every(1, 'week').onthe(1, 'day');
//   test.equal(parsedSchedule, {
//     period: 'week'
//     , interval: 1
//     , on: {
//       period: 'day'
//       , at: 1
//     }
//   });
// });
