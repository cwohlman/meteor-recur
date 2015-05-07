_.each([
  // [schedule, expected dates]
  [
    "Every day at 10 am"
    , {
      period: 'day'
      , interval: 1
      , on: {
        period: 'minutes'
        , at: 60 * 10
      }
    }
    , "2015-01-01T00:00:00"
    , "2015-01-02T00:00:00"
    , [
      "2015-01-01T10:00:00"
    ]
  ]
  , [
    "Every other day at 10 am"
    , {
      period: 'day'
      , interval: 2
      , offset: 1
      , on: {
        period: 'minutes'
        , at: 60 * 10
      }
    }
    , "2015-01-01T00:00:00"
    , "2015-01-03T00:00:00"
    , [
      "2015-01-02T10:00:00"
    ]
  ]
  , [
    "Every other day at 10 am, 2 pm, and 2 am (next day)"
    , {
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
    , "2015-01-04T00:00:00"
    , [
      "2015-01-02T10:00:00"
      , "2015-01-02T14:00:00"
      , "2015-01-03T02:00:00"
    ]
  ]
  , [
    "Every other week on mondays and fridays at 10 am"
    , {
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
            period: 'minutes'
            , at: 60 * 10
          }
        }
      ]
    }
    , "2014-12-28T00:00:00"
    , "2015-01-12T00:00:00"
    , [
      "2014-12-29T10:00:00"
      , "2015-01-02T10:00:00"
    ]
  ]
  , [
    "When start is not zeroed out"
    , {
      period: 'day'
      , interval: 1
      , on: {
        period: 'minutes'
        , at: 60 * 10
      }
    }
    , "2015-01-01T09:00:00"
    , "2015-01-02T00:00:00"
    , [
      "2015-01-01T10:00:00"
    ]
  ]
  , [
    "Twice a week, sunday and saturday"
    , {
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
    , "2015-01-11T00:00:00"
    , [
      "2015-01-03T10:00:00"
      , "2015-01-04T10:00:00"
      , "2015-01-10T10:00:00"
    ]
  ]
], function (args) {
  var name = args.shift();
  var schedule = args.shift();
  var start = moment(args.shift()).toDate();
  var end = moment(args.shift()).toDate();
  var dates = _.map(args.shift(), function (a) {
    return moment(a).toDate();
  });

  Tinytest.add('Recur - getInstances - ' + name, function (test) {
    test.equal(Recur.getInstances(schedule, start, end), dates);
  });
});

