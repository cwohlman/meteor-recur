Recur
=========================

I wrote this package because I just needed some simple recurrence parsing and the existing parsers didn't work acceptably.

Why not use later.js?
=========================

Because under certain circumstances `later.parse.text('every 2 weeks')` outputs 2 weeks in a row.

How can I use this pacakge?
==========================

Recur uses a simple json syntax for storing recurrence patters:

```javascript
// Every other week on mondays and fridays at 10 am
{
  period: 'week'
  , interval: 2
  , offset: 0
  , on: [
    {
      period: 'day'
      , at: 1
      , on: {
        // This rule specifies that an instance exists 600 minutes after the 
        // start of the parent rule, e.g. 10:00 am
        period: 'minutes'
        , at: 60 * 10
      }
    }
    // there's often more than one way to get the same result:
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
```

Take a look at the tests for more examples.

Is this package complete?
==========================

Not even close, there are still a lot of features that need implementing:
1. intersections and exclusions, proposed format:
    
    ```javascript
    // Every Friday the 13th
    {
        intersection: [
            {
                period: 'month'
                , interval: 1
                , on: {
                    period: 'day'
                    , at: 13
                }
            }
            , {
                period: 'week'
                , interval: 1
                , on: {
                    period: 'day'
                    , at: 5
                }
            }
        ]
    }
    // Every 2nd Saturday, except in March
    {
        period: 'week'
        , interval: 1
        , on: {
            period: 'day'
            , at: 6
        }
        , excluding: {
            period: 'year'
            , on: {
                period: 'month'
                , at: 3
            }
        }
    }
    ```

2. parsers (like later.js has)
3. support for more complex combinations without the need to use intersection, for example a way to specify second saturday after the first monday.
4. More Tests!


