
package com.emergency.resourcecoordination.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Entity
@Table(name = "shelter")
@Data
public class Shelter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Shelter name is required")
    private String name;

    @NotBlank(message = "Location is required")
    private String location;

    @Positive(message = "Capacity must be positive")
    private Integer capacity;

    @PositiveOrZero(message = "Occupancy cannot be negative")
    private Integer occupancy = 0;

    @Enumerated(EnumType.STRING)
    private Status status = Status.OPEN;

    public enum Status {
        OPEN, FULL, CLOSED
    }
}