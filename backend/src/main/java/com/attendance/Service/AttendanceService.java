package com.attendance.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.attendance.Model.Attendance;
import com.attendance.Repository.AttendanceRepository;

import java.util.List;
import java.util.Optional;

@Service
public class AttendanceService {
    @Autowired
    private AttendanceRepository attendanceRepository;

    public List<Attendance> getAllAttendanceRecords() {
        return attendanceRepository.findAll();
    }

    public String getAttendanceById(String id) {
        Optional<Attendance> attendance = attendanceRepository.findById(id);
        return attendance.map(value -> "Attendance record found for Employee ID: " + value.getEmployeeId())
                         .orElse("Attendance record with ID " + id + " not found.");
    }

    public String saveAttendance(Attendance attendance) {
        attendanceRepository.save(attendance);
        return "Attendance record for Employee ID " + attendance.getEmployeeId() + " saved successfully!";
    }

    public String deleteAttendance(String id) {
        if (attendanceRepository.existsById(id)) {
            attendanceRepository.deleteById(id);
            return "Attendance record with ID " + id + " has been deleted.";
        } else {
            return "Attendance record with ID " + id + " does not exist.";
        }
    }
}

