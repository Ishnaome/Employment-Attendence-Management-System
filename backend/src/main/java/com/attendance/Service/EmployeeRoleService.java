package com.attendance.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.attendance.Model.EmployeeRole;
import com.attendance.Repository.EmployeeRoleRepository;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeRoleService {
    @Autowired
    private EmployeeRoleRepository employeeRoleRepository;

    public List<EmployeeRole> getAllEmployeeRoles() {
        return employeeRoleRepository.findAll();
    }

    public String getEmployeeRoleById(String employeeId) {
        Optional<EmployeeRole> employeeRole = employeeRoleRepository.findById(employeeId);
        return employeeRole.map(value -> "Role found for Employee ID: " + value.getEmployeeId())
                           .orElse("No role found for Employee ID " + employeeId);
    }

    public String saveEmployeeRole(EmployeeRole employeeRole) {
        employeeRoleRepository.save(employeeRole);
        return "Role assigned to Employee ID " + employeeRole.getEmployeeId() + " successfully!";
    }

    public String deleteEmployeeRole(String employeeId) {
        if (employeeRoleRepository.existsById(employeeId)) {
            employeeRoleRepository.deleteById(employeeId);
            return "Role for Employee ID " + employeeId + " has been removed.";
        } else {
            return "No role found for Employee ID " + employeeId;
        }
    }
}