package com.attendance.Service;




import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.attendance.Model.Employee;
import com.attendance.Repository.EmployeeRepository;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {
    @Autowired
    private EmployeeRepository employeeRepository;

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public String getEmployeeById(String id) {
        Optional<Employee> employee = employeeRepository.findById(id);
        return employee.map(value -> "Employee found: " + value.getFirstName() + " " + value.getLastName())
                       .orElse("Employee with ID " + id + " not found.");
    }

    public String saveEmployee(Employee employee) {
        employeeRepository.save(employee);
        return "Employee " + employee.getFirstName() + " " + employee.getLastName() + " saved successfully!";
    }

    public String deleteEmployee(String id) {
        if (employeeRepository.existsById(id)) {
            employeeRepository.deleteById(id);
            return "Employee with ID " + id + " has been deleted.";
        } else {
            return "Employee with ID " + id + " does not exist.";
        }
    }
}
