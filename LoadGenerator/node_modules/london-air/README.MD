# London-Air

A JS wrapper for the London air quality API provided by http://www.londonair.org.uk/.

The API can be used to get real time pollution information for different London areas.

## Usage
### Install
`npm install london-air`

To begin using:

```
    var londonAir = require('london-air');
    londonAir.pollution.getHourlyPollutionLevels(null, function(error, response) {
        console.log(response);
    });
```

## Pollution Levels

### Hourly levels
To get hourly pollution levels for every area in London:

```
londonAir.pollution.getHourlyPollutionLevels(null, callback(error, response));
```

To get hourly pollution levels for a specific area provide the site code of the area as the first argument.

```
londonAir.pollution.getHourlyPollutionLevels('BG1', callback(error, response));
```
[Full list of site codes that can be used in the request.](site_codes.md)

## Health Messages
To get a list of health advice for each pollution level:
```
londonAir.healthMessage.getAllHealthMessages(callback(error, response));
```

## Data Source
All data comes from http://www.londonair.org.uk/Londonair/API/
