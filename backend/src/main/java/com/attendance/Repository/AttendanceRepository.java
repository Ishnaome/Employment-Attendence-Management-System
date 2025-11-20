package com.attendance.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.attendance.Model.Attendance;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, String> {
}
