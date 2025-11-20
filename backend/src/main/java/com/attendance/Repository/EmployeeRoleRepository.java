package com.attendance.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.attendance.Model.EmployeeRole;

@Repository
public interface EmployeeRoleRepository extends JpaRepository<EmployeeRole, String> {
}

