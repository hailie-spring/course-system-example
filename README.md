# Course Management System
This is a whole website example including frontend, backend, deployment.

The frontend client is implemented with javascript, materail-ui, react-hooks.   
And the backend service is implemented with nodejs, elasticsearch, redis.  
The interaction with restful api, to avoid cross-domain, use nginx as proxy service.  

All services run in docker and organized with docker compose. Welcome to watch and star ^_^  

The project is about course system management. With it, companied could record contract and attendance with students.  
It provides query, add, delete and update operations.
![Animated demo](https://github.com/hailie-spring/course-system-example/blob/main/introduction/course-system-introduction.gif)


# Development

The steps to start the service is:
1. git clone 
2. cd  course-system-example/deployment
3. make setup
4. make up
5. make esmanage
6. visit http://${host}:8080

If want to stop the service:   

make down

# deployment

![Animated demo](https://github.com/hailie-spring/course-system-example/blob/main/introduction/course-system-deployment-example%20.gif)

