## Einabit Sandbox API

This project allows you to mock a service with similar behavior as Einabit API so you can connect your project and quickly develop solutions. Or for just simply try our stuff.

## Usage

> You need to have docker installed in your computer and internet access in order to pull the public image

- Create a config file following the documentation
- Run the following command to execute the service using the public image from [Dockerhub Repo](https://hub.docker.com/repository/docker/einabit/sandbox):
```
docker run --rm -d -e CONFIG="$(cat config.yml)" -p 1337:1337 --name einabit einabit/sandbox
```

Connect to it using any client:

- [Nodejs SDK](https://github.com/Einabit/client.js)
- [Java SDK](https://github.com/Einabit/client.java)
- [Python SDK](https://github.com/Einabit/client.py)

## (Optional) Encryption

When using production environment, meaning real Einabit API, you will be provided with an encryption key since the API service will only answer to encrypted messages or queries.

If you want to try out this behavior you can provide a key as an environment variable `PASSPHRASE` to the sandbox.

This is optional when using the sandbox. The sandbox service will not try to decrypt messages if `PASSPHRASE` is not provided. Bare it in mind.

```
docker run --rm -d -e PASSPHRASE="<32 bit hex string>" -e CONFIG="$(cat config.yml)" -p 1337:1337 --name einabit einabit/sandbox
```

If you have node installed in your machine you can generate a random key using this command: `node -p 'require("crypto").randomBytes(16).toString("hex")'`

## Quick start & samples

1. Simple temperature mock, the variable will increase or decrease by 1 each 400 ms
```yml
temp1:
  value:
    min: 0
    max: 100
    step: 1
  interval:
    ms: 400
    skip: 0
```

2. Simple photocell mock, the variable will change from 0 to 1 and vice versa every 2000 ms with a 20% skipping rate
```yml
vis1:
  value:
    min: 0
    max: 1
    step: 1
  interval:
    ms: 2000
    skip: .2
```

3. carriage sensor that will randomly increase or decrease by 2 from 20 to 40 every 1200 ms with a 50% skipping rate
```yml
crg1:
  value:
    min: 20
    max: 40
    step: 2
  interval:
    ms: 1200
    skip: .5
```

## Documentation

yml file must contain at least one variable

|Path |Type  | Sample| Description|
|--- | --- |--- |--- |
|[_name]|string|temp0,vis8,signal4,auto2|Name of the variable
|[_name.value.min]|int|0|Minimum value allowed when decreasing
|[_name.value.max]|int|50|Maximum value allowed when increasing
|[_name.value.step]|int|2|Increment up or down
|[_name.interval.ms]|int|400|Milliseconds elapsed for every operation
|[_name.interval.skip]|float|0.4|operation skipping based on ratio (0.4 -> 40% skip)

## Show me more!

Since our services have to provide real time information we rely on sockets to do this. However it is pretty straight forward process with SDKs above referenced.

SDKs above referenced do that but they provide a layer of abstraction so you don't have to mess with primitives of asynchronous communication. In case you want to learn how the process works or just because you're thinking on developing another SDK for a different language here are the `telnet` instructions that describe the available API.

[In Deep Guide](DEEP_GUIDE.md)
