# car-manager

### Adding a car
Execute a **POST** at: http://localhost:8080/api  
The post body should contain car data in JSON format.\
The car ID can be set to -1 to generate the next available ID.\
Valid data examples:
```yaml
// Standard
{"id": 3, "make": "coolcars", "model": "premium", "seats": 2}

// Automatic ID
{"id": -1, "make": "coolcars", "model": "standard", "seats": 4}
```

### Removing a car
Execute a **DELETE** at: http://localhost:8080/api  
The post body should contain car data in JSON format (only an ID is actually required).\
Valid data examples:
```yaml
// Minimal requirement where 'id' is an existing integer ID number.
{"id": 3}
```

### Updating a car
Execute a **PUT** at: http://localhost:8080/api  
The post body should contain car data in JSON format.\
Data must have a target ID and either a new model, new seat number, or both.\
Valid data examples:
```yaml
// Two values to update
{"id": 3, "model": "premium 2", "seats": 4}

// Only one value
{"id": 3, "seats": 4}
{"id": 3, "model": "premium 2"}
```
