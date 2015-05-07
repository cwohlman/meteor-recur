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
  } else if (_.isDate(schedule.offset)) {
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
    next = offset.add(mod ? (diff + (schedule.interval - mod)) : diff, schedule.period);
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

function getInstances(schedule, start, end) {
  var next = moment(start);

  next = getNextFromOffset(schedule, next);

  if (schedule.interval) {
    var results = [];
    while (next.toDate() < end) {
      results = results.concat(getInstancesFromChild(schedule, schedule.on, next.clone(), end));
      next.add(schedule.interval, schedule.period);
    }
    return results;
  } else {
    return getInstancesFromChild(schedule, schedule.on, next, end);
  }
};

Recur = {
  getInstances: getInstances
};