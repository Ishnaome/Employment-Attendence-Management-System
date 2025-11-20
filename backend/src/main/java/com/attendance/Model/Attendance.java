package com.attendance.Model;



import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "attendance")
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String employeeId;

    @Column(nullable = true)
    private String label;
    
    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = true)
    private LocalTime checkInTime;

    @Column(nullable = true)
    private LocalTime checkOutTime;

    @Column(nullable = false)
    private String status; // Present, Absent, Late

    // Constructors, Getters, and Setters
    public Attendance() {}

    public Attendance(String id, String employeeId, String label, LocalDate date, LocalTime checkInTime, LocalTime checkOutTime, String status) {
        this.id = id;
        this.employeeId = employeeId;
        this.date = date;
        this.checkInTime = checkInTime;
        this.checkOutTime = checkOutTime;
        this.status = status;
        this.label = label;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public LocalTime getCheckInTime() { return checkInTime; }
    public void setCheckInTime(LocalTime checkInTime) { this.checkInTime = checkInTime; }
    public LocalTime getCheckOutTime() { return checkOutTime; }
    public void setCheckOutTime(LocalTime checkOutTime) { this.checkOutTime = checkOutTime; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
