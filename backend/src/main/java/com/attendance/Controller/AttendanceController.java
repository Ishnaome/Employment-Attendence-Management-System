package com.attendance.Controller;


import com.attendance.Model.Attendance;
import com.attendance.Service.AttendanceService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*") // allow frontend calls
@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @GetMapping("/all")
    public ResponseEntity<List<Attendance>> getAllAttendanceRecords() {
        return ResponseEntity.ok(attendanceService.getAllAttendanceRecords());
    }

    @GetMapping("/{id}")
    public ResponseEntity<String> getAttendanceById(@PathVariable String id) {
        return ResponseEntity.ok(attendanceService.getAttendanceById(id));
    }

    @PostMapping
    public ResponseEntity<String> createAttendance(@RequestBody Attendance attendance) {
        return ResponseEntity.ok(attendanceService.saveAttendance(attendance));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAttendance(@PathVariable String id) {
        return ResponseEntity.ok(attendanceService.deleteAttendance(id));
    }
}
