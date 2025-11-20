package com.attendance.Controller;


import com.attendance.Model.EmployeeRole;
import com.attendance.Service.EmployeeRoleService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*") // allow frontend calls
@RestController
@RequestMapping("/api/employeeRoles")
public class EmployeeRoleController {

    @Autowired
    private EmployeeRoleService employeeRoleService;

    @GetMapping
    public ResponseEntity<List<EmployeeRole>> getAllEmployeeRoles() {
        return ResponseEntity.ok(employeeRoleService.getAllEmployeeRoles());
    }

    @GetMapping("/{employeeId}")
    public ResponseEntity<String> getEmployeeRoleById(@PathVariable String employeeId) {
        return ResponseEntity.ok(employeeRoleService.getEmployeeRoleById(employeeId));
    }

    @PostMapping
    public ResponseEntity<String> saveEmployeeRole(@RequestBody EmployeeRole employeeRole) {
        return ResponseEntity.ok(employeeRoleService.saveEmployeeRole(employeeRole));
    }

    @DeleteMapping("/{employeeId}")
    public ResponseEntity<String> deleteEmployeeRole(@PathVariable String employeeId) {
        return ResponseEntity.ok(employeeRoleService.deleteEmployeeRole(employeeId));
    }
}
