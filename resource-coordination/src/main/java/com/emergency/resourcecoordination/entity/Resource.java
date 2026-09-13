package com.emergency.resourcecoordination.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "resource")
@Data
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Resource type is required")
    private String resourceType;

    @Positive(message = "Quantity must be positive")
    private Integer quantityAvailable;

    @NotBlank(message = "Unit is required")
    private String unit;

    @NotBlank(message = "Location is required")
    private String location;

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDateTime lastUpdated;

    public enum Status {
        AVAILABLE, LOW, DEPLETED
    }
}