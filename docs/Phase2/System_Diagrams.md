# System Diagrams

This document contains the UML Diagrams for the Student Task Manager system.

## 1. Use Case Diagram

The Use Case Diagram describes the primary actors and their interactions with the system.

```mermaid
usecaseDiagram
    actor Student
    
    rectangle "TaskFlow System" {
        usecase "Register Account" as UC1
        usecase "Login" as UC2
        usecase "Manage Tasks" as UC3
        usecase "View Calendar" as UC4
        usecase "Use Pomodoro Timer" as UC5
        usecase "View Statistics" as UC6
        usecase "Create Task" as UC3_1
        usecase "Edit Task" as UC3_2
        usecase "Delete Task" as UC3_3
    }

    Student --> UC1
    Student --> UC2
    Student --> UC3
    Student --> UC4
    Student --> UC5
    Student --> UC6
    
    UC3 ..> UC3_1 : <<includes>>
    UC3 ..> UC3_2 : <<includes>>
    UC3 ..> UC3_3 : <<includes>>
```

## 2. Class Diagram

The Class Diagram outlines the data structures (models) and their attributes/relationships.

```mermaid
classDiagram
    class User {
        +ObjectId _id
        +String name
        +String email
        +String password
        +Date createdAt
        +Date updatedAt
        +matchPassword(enteredPassword) Boolean
    }

    class Task {
        +ObjectId _id
        +ObjectId user
        +String title
        +String description
        +Date dueDate
        +String status
        +String priority
        +String category
        +Date createdAt
        +Date updatedAt
    }

    User "1" --> "*" Task : creates
```

## 3. Sequence Diagram: Task Creation Flow

This diagram illustrates the flow of messages between the client, server, and database when a user creates a new task.

```mermaid
sequenceDiagram
    actor User
    participant Client as React Client
    participant API as Express Router
    participant Controller as Task Controller
    participant DB as MongoDB

    User->>Client: Fills out Task Form & clicks 'Submit'
    Client->>API: POST /api/tasks (with JWT token & Task Data)
    API->>API: Auth Middleware validates JWT
    alt Invalid Token
        API-->>Client: 401 Unauthorized
        Client-->>User: Show Error Notification
    else Valid Token
        API->>Controller: createTask(req, res)
        Controller->>DB: new Task({ ...req.body, user: req.user._id }).save()
        DB-->>Controller: Saved Task Document
        Controller-->>API: 201 Created (JSON Response)
        API-->>Client: 201 Created (JSON Response)
        Client-->>User: Task added to UI list / Show Success Notification
    end
```
