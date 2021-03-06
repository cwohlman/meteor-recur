// Write your package code here!
function zero() {
  return moment("0000-01-01T00:00:00");
}

function getNextFromOffset(schedule, next) {
  var offset;

  // offset can be specified in several different formats,
  // the key though is that they each represent an offset from the unix epoch
  if (_.isNumber(schedule.offset)) {
    offset = zero().add(schedule.offset, schedule.period);
  } else if (schedule.offset) {
    offset = moment(schedule.offset);
  } else if (schedule.interval) {
    offset = zero();
  }

  if (offset) {
    // we want to be sure we're dealing with the start of the period here
    // e.g. if we're calculating every other week we need to be sure that the
    // offset date isn't on a thursday.
    offset = offset.startOf(schedule.period);

    var diff = next.diff(offset, schedule.period, true);
    // We want to push next to the next valid time period.
    // e.g. if next is 15 minutes past midnight, and offset is 20, we want to
    // push next to 20 minutes past midnight.
    var mod = (diff % schedule.interval);
    next = offset.add(diff - mod, schedule.period);
  }

  return next;
}

function getNextInstance(schedule, instance, period, next, end) {
  // XXX dates
  instance = next.clone().add(instance, period).toDate();
  if (instance < end)
    return [instance];
  else
    return [];
}

function getInstancesFromChild(schedule, instance, next, end) {
  if (!instance)
    return next.toDate();

  // ensure we don't return any instances which are in the next period
  if (schedule.interval)
    end = moment.min(next.clone().add(schedule.interval, schedule.period), moment(end)).toDate();

  if (_.isArray(instance)) {
    return _.flatten(_.map(instance, function (instance) {
      return getInstancesFromChild(schedule, instance, next, end);
    }));
  }

  if (_.isFinite(instance.interval)) {
    return getInstances(instance, next.toDate(), end);
  }

  if (_.isString(instance.period)) {
    return getNextInstance(schedule, instance.on, instance.period, next, end);
  }

  if (_.isNumber(instance) || _.isDate(instance)) {
    return getNextInstance(schedule, instance, schedule.period, next, end);
  }

  return next.toDate();
}

// function getInstances(schedule, start, end) {
//   var next = moment(start);

//   next = getNextFromOffset(schedule, next);

//   if (schedule.interval) {
//     var results = [];
//     while (next.toDate() < end) {
//       results = results.concat(getInstancesFromChild(schedule, schedule.on, next.clone(), end));
//       next.add(schedule.interval, schedule.period);
//     }
//     return results;
//   } else {
//     return getInstancesFromChild(schedule, schedule.on, next, end);
//   }
// };

function parsePeriod(schedule, child, next, start, end, count, shortcuts) {
  var value = child.at;
  if (_.isString(value) && shortcuts)
    value = shortcuts[value] || value;

  if (_.isNumber(value))
    return next.clone().add(value, child.period);
  if (_.isDate(value)) {
    var diff = moment(value).diff(moment(value).clone().startOf(schedule.period), child.period);
    return next.clone().add(diff, child.period);
  }
  throw new Error("Could not parse period");
}

function getNext(next, start, end) {
  next = next.clone().toDate();
  if (next < end && next >= start)
    return [next];
  else
    return [];
}

function parseChild(schedule, child, next, start, end, count, shortcuts) {
  next = next.clone();
  if (child.interval)
    return parseBetween(child, next, start, end, count, shortcuts);
  if (child.at)
    next = parsePeriod(schedule, child, next, start, end, count, shortcuts);
  if (child.on)
    return parseOn(child, next, start, end, count, shortcuts);
  else
    return getNext(next, start, end);
}

function parseOn(schedule, next, start, end, count, shortcuts) {
  if (schedule.on) {
    if (_.isArray(schedule.on)) {
      var innerCount = 0;
      return _.flatten(_.map(schedule.on, function (subSchedule) {
        var results = parseChild(schedule, subSchedule, next, start, end, count - innerCount, shortcuts);
        innerCount += results.length;
        return results;
      }));
    }
    if (_.isObject(schedule.on))
      return parseChild(schedule, schedule.on, next, start, end, count, shortcuts);

    return parseChild(schedule, schedule, next, start, end, count, shortcuts);
  } else {
    return getNext(next, start, end);
  }
}

function parseAt(schedule, next, start, end, count, shortcuts) {
  if (schedule.at) {
    next = parsePeriod(schedule, schedule, next, start, end, count, shortcuts);
  }
  return parseOn(schedule, next, start, end, count, shortcuts);
}

function parseInterval(schedule, next, start, end, count, shortcuts) {
  if (schedule.interval) {
    if (!_.isNumber(schedule.interval))
      throw new Error('expected a number');
    var results = []
      , localEnd
      , localCount
      ;

    next = getNextFromOffset(schedule, next);
    while (next.toDate() < end && (!count || count > results.length)) {
      localEnd = moment.min(moment(end), next.clone().add(schedule.interval, schedule.period)).toDate();
      localCount = count - results.length;
      results = results.concat(parseAt(schedule, next.clone(), start, end, count, shortcuts));
      next = next.add(schedule.interval, schedule.period);
    }
    return results;
  } else {
    return parseAt(schedule, next, start, end, count, shortcuts);
  }
}

function parseBetween(schedule, next, start, end, count, shortcuts) {
  if (schedule.between) {
    var scheduleStart = moment(schedule.between[0]);
    var scheduleEnd = moment(schedule.between[1]);
    
    // XXX instead of checking for isValid, check for === null
    if (scheduleStart.isValid())
      start = moment.max(moment(start), scheduleStart);
    if (scheduleEnd.isValid())
      end = moment.min(moment(end), scheduleEnd);
  }
  return parseInterval(schedule, next, start, end, count, shortcuts);
}

function getInstances() {
  var args = _.toArray(arguments);
  var schedule = args.shift();
  var count, start, end, shortcuts;
  while (args.length) {
    var arg = args.shift();
    if (_.isNumber(arg) && _.isUndefined(count))
      count = arg;
    else if (_.isDate(arg) && !start)
      start = arg;
    else if (_.isDate(arg) && !end)
      end = arg;
    else if (!_.isDate(arg) && _.isObject(arg) && !shortcuts)
      shortcuts = arg;
    else
      throw new Error('too many or invalid arguments');
  }
  if (start && !end && !count) {
    end = start;
    start = null;
  }
  if (!start)
    start = new Date();

  if (!count && !end)
    throw new Error('too few arguments');

  var next = moment(start);

  return parseBetween(schedule, next, start, end, count, shortcuts);
}

Recur = {
  getInstances: getInstances
};