package com.attendance.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.attendance.Model.Role;
import com.attendance.Repository.RoleRepository;

import java.util.List;
import java.util.Optional;

@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    public String getRoleById(String id) {
        Optional<Role> role = roleRepository.findById(id);
        return role.map(value -> "Role found: " + value.getName())
                   .orElse("Role with ID " + id + " not found.");
    }

    public String saveRole(Role role) {
        roleRepository.save(role);
        return "Role '" + role.getName() + "' saved successfully!";
    }

    public String deleteRole(String id) {
        if (roleRepository.existsById(id)) {
            roleRepository.deleteById(id);
            return "Role with ID " + id + " has been deleted.";
        } else {
            return "Role with ID " + id + " does not exist.";
        }
    }
}
