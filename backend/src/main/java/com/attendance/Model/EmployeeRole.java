package com.attendance.Model;



import jakarta.persistence.*;

@Entity
@Table(name = "employee_roles")
public class EmployeeRole {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String employeeId;

    @Column(nullable = false)
    private String roleId;

    // Constructors, Getters, and Setters
    public EmployeeRole() {}

    public EmployeeRole(String id, String employeeId, String roleId) {
        this.id = id;
        this.employeeId = employeeId;
        this.roleId = roleId;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
    public String getRoleId() { return roleId; }
    public void setRoleId(String roleId) { this.roleId = roleId; }
}
