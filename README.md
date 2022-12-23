## @Einabit/sandbox

This project allows you to mock a service with similar behavior as Einabit API so you can connect your project and quickly develop solutions. Or for just simply try our stuff.

## Usage

- Head to downloads and get the latest release
- Create a config file following the documentation
- Run the project
- Connect to it using any client [Einabit repos](https://github.com/orgs/Einabit/repositories)

## Quick start & samples

1. Simple temperature mock, the variable will increase or decrease by 3 each 300 ms
```yaml
temp1:
  value:
    min: 0
    max: 10
    step: 5
  interval:
    minMs: 400
    maxMs: 800
```

2. Simple photocell mock, the variable will change from 0 to 1 and vice versa every 500 ms
```yaml
vis1:
  step: 1
  interval: 500
  min: 0
  max: 1
```

## Documentation
