package com.attendance.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.attendance.Model.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
}
