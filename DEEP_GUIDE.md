## In deep guide

First and foremost you need a working service. Unless you have access to a real API provided by us (Einabit) you need to start a docker container using the oficial image from [Dockerhub Repo](https://hub.docker.com/repository/docker/einabit/sandbox)

Sample below create a config file emulating a carriage sensor that will randomly increase or decrease by 2 from 20 to 40 every 1200 ms with a 50% skipping rate as defined here in the [docs](https://github.com/Einabit/sandbox#documentation)

```yml
# config.yml
crg1:
  value:
    min: 20
    max: 40
    step: 2
  interval:
    ms: 1200
    skip: .5
```

```
docker run --rm -d -e CONFIG="$(cat config.yml)" -p 1337:1337 --name apimock einabit/sandbox
```

As we can see `docker ps` will show the container running.

We can sh into it `docker exec -it apimock sh` to see how data is created.

Inside the container a file called **raw** represents the data persistence, we may `tail -f raw` to see it grow in real time.

We may add more sensor definitions to the **config.yml** and restart the container to add up features.

In order to extract information from the API there are three options or available commands: *value, fetch* and *tap*. These commands may have arguments and behavior, the documentation is as follows.

The communication with the service has to be done using sockets. So the API service is listening for connections on **port 1337**. A client has to open up a socket connection and then send a command instruction.

Every connection is meant to be a *channel of communication*, some connections may be destroy as soon as the server answers back with the information requested (IE like a query), other connection may be open as long as the client needs so the server keeps up sending information (IE like a subscription).

Every connection hence follows this diagram:

1. Server is waiting for connections.
2. Client opens up a new socket connection.
3. Client uses the connection to send a command.
4. Server receives the command.
5. Server answers with the requested information.
6. The server closes the connection*.

> *In case of TAP command the server does not close the connection and will keep sending information until the client closes the connection instead.

Available commands:

**value**.

Description: Retrieves the last registered value for a particular sensor (current value).

Arguments: sensorname

Example with telnet:
```
$ telnet localhost 1337
Trying ::1...                          # client is reaching the server.
Connected to localhost.                # client and server are connected.
Escape character is '^]'.              # this is usually CTRL+5.
value,crg1^]                           # type command,sensorname^]
telnet>                                # here we just press ENTER (CR) to commit the message.
crg1,22,1676392483800                  # The server will answer with the requested information.
Connection closed by foreign host.     # Finally the server closes the connection

```

**fetch**.

Description: Retrieves for a particular sensor within the specified date range.

Arguments: sensorname,fromts,tots

Example with telnet:
```
$ telnet localhost 1337
Trying ::1...                             # client is reaching the server.
Connected to localhost.                   # client and server are connected.
Escape character is '^]'.                 # this is usually CTRL+5.
fetch,crg1,1676392483800,1676393269491^]  # type command,sensorname,fromts,tots^]
telnet>                                   # here we just press ENTER (CR) to commit the message.
crg1,20,1676393264611
crg1,22,1676393263409
crg1,20,1676393252597
... (a bunch of data)
Connection closed by foreign host.        # Finally the server closes the connection

```

**tap**.

Description: gets current value for a particular sensor and sends subsequent changes. Optionally the client may send a last argument for the server to include data since that date. Finally the client is the one who closes the connection.

Arguments: sensorname,(optional)fromts

Example with telnet:
```
$ telnet localhost 1337
Trying ::1...                             # client is reaching the server.
Connected to localhost.                   # client and server are connected.
Escape character is '^]'.                 # this is usually CTRL+5.
tap,crg1,1676392483800^]                  # type command,sensorname,?fromts^]
telnet>                                   # here we just press ENTER (CR) to commit the message.
crg1,20,1676393264611
crg1,22,1676393263409
crg1,20,1676393252597
... (the server will keep on sending information until the client closes the connection)

```
