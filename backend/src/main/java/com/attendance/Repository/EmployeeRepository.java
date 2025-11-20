package com.attendance.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.attendance.Model.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String> {
}
