package com.attendance.Controller;


import com.attendance.Model.User;
import com.attendance.Service.UserService;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*") // allow frontend calls
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userService.getAllUsers();
        if (users.isEmpty()) {
            return ResponseEntity.ok("No users found.");
        }
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<String> getUserById(@PathVariable String id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(value -> ResponseEntity.ok("User found: " + value.getUsername()))
                   .orElseGet(() -> ResponseEntity.badRequest().body("User not found with ID: " + id));
    }

    @PostMapping
    public ResponseEntity<String> createUser(@RequestBody User user) {
        userService.createUser(user);
        return ResponseEntity.ok("User '" + user.getUsername() + "' created successfully!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable String id) {
        boolean deleted = userService.deleteUser(id);
        if (deleted) {
            return ResponseEntity.ok("User with ID " + id + " deleted successfully.");
        }
        return ResponseEntity.badRequest().body("User not found with ID: " + id);
    }
}

